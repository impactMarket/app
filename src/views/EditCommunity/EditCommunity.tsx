import { Box, Display } from '@impact-market/ui';
import { Community, Contract } from '../../api/community';
import { editCommunitySchema } from '../../utils/communities';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import { useForm } from 'react-hook-form';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useYupValidationResolver } from '../../helpers/yup';
import CommunityDetailsForm from './CommunityDetailsForm';
import CommunityManagementForm from './CommunityManagementForm';
import ContractDetailsForm from './ContractDetailsForm';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const EditCommunity: React.FC<{ community: Community, contract: Contract }> = props => {
    const { community, contract } = props;
    const [maxBeneficiaries, setMaxBeneficiaries] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    const router = useRouter();
    const { t } = useTranslations();
    const { isCommunityLocked, getMaxBeneficiaries } = useAmbassador();

    const [communityImage, setCommunityImage] = useState() as any;

    const rates = useSelector(selectRates);

    const { extractFromView } = usePrismicData();
    const { communityContent, communityTitle } = extractFromView(
        'heading'
    ) as any;

    const auth = useSelector(selectCurrentUser);
    const [currency] = useState(auth?.user?.currency || 'USD');

    const [formFields, setFormFields] = useState({
        baseInterval: '',
        claimAmount: '',
        description: '',
        incrementInterval: 0,
        maxBeneficiaries: 0,
        maxClaim: '',
    });

    useEffect(() => {
        const init = async () => {
            try {
                if (!!community?.contractAddress) {
                    const isLocked = await isCommunityLocked(
                        community?.contractAddress
                    );
                    const maxBeneficiaries = await getMaxBeneficiaries(
                        community?.contractAddress
                    );

                    setIsLocked(isLocked);
                    setMaxBeneficiaries(maxBeneficiaries);
                } else {
                    setIsLocked(null);
                    setMaxBeneficiaries(null);
                }                
            } catch (error) {
                console.log(error);

                router.push('/communities');

                return false;
            }
        };

        init();
    }, []);

    const {
        formState: { errors, submitCount },
        setValue,
        reset
    } = useForm({
        resolver: useYupValidationResolver(editCommunitySchema)
    });

    useEffect(() => {
        setFormFields({
            baseInterval: contract?.baseInterval === 17280 ? t('day').toLowerCase() : t('week').toLowerCase() || '',
            claimAmount: contract?.claimAmount || '',
            description: community?.description || '',
            incrementInterval: contract?.incrementInterval || 0,
            maxBeneficiaries: maxBeneficiaries || 0,
            maxClaim: contract?.maxClaim || '',
        });

        Object.entries(formFields).forEach(([name, value]: any) =>
            setValue(name, value)
        );

        setCommunityImage(
            getImage({
                filePath: community?.coverMediaPath,
                fit: 'cover',
                height: 160,
                width: 160
            })
        ) as any;
    }, [community, contract, maxBeneficiaries]);

    console.log(community)

    return (
        <>
            <Box fLayout="start between" fWrap="wrap" flex>
                <Box
                    column
                    flex
                    pr={{ sm: 2, xs: 0 }}
                    w={{ sm: '75%', xs: '100%' }}
                >
                    <Display g900 medium>
                        {communityTitle}
                    </Display>
                    <RichText content={communityContent} g500 mt={0.25} />
                </Box>
            </Box>
            <Box mt={4}>
                <CommunityDetailsForm
                    community={community}
                    communityImage={communityImage}
                    formData={{
                        coverMediaPath: community?.coverMediaPath,
                        description: community?.description,
                        name: community?.name
                    }}
                    setCommunityImage={setCommunityImage}
                    submitCount={submitCount}
                />
            </Box>
            <Box mt={1.25}>
                {!!auth?.user?.councilMember && !!community.contractAddress && (
                    <ContractDetailsForm
                        community={community}
                        currency={currency}
                        errors={errors}
                        formData={{
                            baseInterval:
                                contract?.baseInterval === 17280
                                    ? t('day').toLowerCase()
                                    : t('week').toLowerCase() || '',
                            claimAmount: contract?.claimAmount,
                            incrementInterval: contract?.incrementInterval / 12,
                            maxClaim: contract?.maxClaim
                        }}
                        rates={rates}
                    />
                )}

                {!!auth?.user?.ambassador && isLocked !== null && maxBeneficiaries !== null &&
                    community?.ambassadorAddress?.toLowerCase() ===
                        auth?.user?.address?.toLowerCase() && (
                        <CommunityManagementForm
                            communityAddress={community?.contractAddress}
                            errors={errors}
                            isLocked={isLocked}
                            maxBeneficiaries={maxBeneficiaries}
                            reset={() => reset(formFields)}
                        />
                    )
                }
            </Box>
        </>
    );
};

export default EditCommunity;
