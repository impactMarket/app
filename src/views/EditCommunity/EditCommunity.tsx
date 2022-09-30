import { Box, Display, ViewContainer } from '@impact-market/ui';
import { addCommunitySchema } from '../../utils/communities';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import { useForm } from 'react-hook-form';
import { useGetCommunityContractMutation, useGetCommunityMutation } from '../../api/community';
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


const EditCommunity: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);
    const [maxBeneficiaries, setMaxBeneficiaries] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [community, setCommunity] = useState({}) as any;
    const [contract, setContract] = useState({}) as any;

    const router = useRouter();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityContract] = useGetCommunityContractMutation();
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
                const id = router?.query?.id as any;
                const communityData = await getCommunity(id).unwrap();
                const contractData = await getCommunityContract(id).unwrap();

                if (!!communityData?.contractAddress) {
                    const isLocked = await isCommunityLocked(
                        communityData?.contractAddress
                    );
                    const maxBeneficiaries = await getMaxBeneficiaries(
                        communityData?.contractAddress
                    );

                    setIsLocked(isLocked);
                    setMaxBeneficiaries(maxBeneficiaries);
                } else {
                    setIsLocked(null);
                    setMaxBeneficiaries(null);
                }
                

                setCommunity(communityData);
                setContract(contractData?.data);
                
                toggleLoadingCommunity(false);
            } catch (error) {
                console.log(error);

                toggleLoadingCommunity(false);

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
        resolver: useYupValidationResolver(addCommunitySchema)
    });

    useEffect(() => {
        setFormFields({
            baseInterval: contract?.baseInterval === 17280 ? t('day').toLowerCase() : t('week').toLowerCase() || '',
            claimAmount: contract?.claimAmount || '',
            description: community?.description || '',
            incrementInterval: contract?.incrementInterval || '',
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

    return (
        <ViewContainer isLoading={isLoading || loadingCommunity}>
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
                {
                    !!auth?.user?.councilMember && !!community.contractAddress && (
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
                                incrementInterval: parseInt(contract?.incrementInterval, 10) / 12,
                                maxClaim: contract?.maxClaim
                            }}
                            rates={rates}
                        />
                    )
                }

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
                    )}
            </Box>
        </ViewContainer>
    );
};

export default EditCommunity;
