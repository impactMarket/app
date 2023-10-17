/* eslint-disable max-depth */
import { Box, Button, Display, toast } from '@impact-market/ui';
import {
    Community,
    Contract,
    useEditPendingCommunityMutation,
    useGetCommunityPreSignedMutation
} from '../../api/community';
import {
    frequencyToNumber,
    frequencyToText,
    useAmbassador
} from '@impact-market/utils';
import {
    getCountryCurrency,
    getCountryNameFromInitials
} from '../../utils/countries';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { useForm, useWatch } from 'react-hook-form';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CommunityForm from '../AddCommunity/CommunityForm';
import ContractForm from '../AddCommunity/ContractForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const EditPending: React.FC<{
    ambassadorAddress: string;
    community: Community;
    contract: Contract;
}> = (props) => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';

    const { ambassadorAddress, community, contract } = props;
    const [isSubmitting, toggleSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(
        getImage({
            filePath: community?.coverMediaPath,
            fit: 'cover',
            height: 160,
            width: 160
        })
    ) as any;
    const [currency, setCurrency] = useState(auth?.user?.currency || null);
    const [maxBeneficiaries, setMaxBeneficiaries] = useState(0);

    const { extractFromView } = usePrismicData({ list: true });
    const { communityTitle, submissionContent } = extractFromView(
        'heading'
    ) as any;
    const { t } = useTranslations();

    const [formFields, setFormFields] = useState({
        baseInterval: '',
        claimAmount: '',
        description: '',
        incrementInterval: 0,
        maxBeneficiaries: 0,
        maxClaim: ''
    });

    const router = useRouter();
    const rates = useSelector(selectRates);
    const [editPendingCommunity] = useEditPendingCommunityMutation();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();
    const { getMaxBeneficiaries } = useAmbassador();

    const location = {
        country: community?.country,
        gps: {
            lat: community?.gps?.latitude,
            lng: community?.gps?.longitude
        },
        label: `${community?.city}, ${getCountryNameFromInitials(
            community?.country
        )}`,
        value: {
            place_id: community?.placeId
        }
    };

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors, submitCount }
    } = useForm({
        defaultValues: {
            baseInterval: frequencyToText(contract?.baseInterval) || '',
            claimAmount: contract?.claimAmount || '',
            description: community?.description || '',
            email: auth?.user?.email || '',
            incrementInterval: contract?.incrementInterval / 12 || '',
            location: location || null,
            maxClaim: contract?.maxClaim || '',
            name: community?.name || ''
        }
    });

    const userNotAmbassadorOrCreator =
        community?.requestByAddress?.toLowerCase() !==
            auth?.user?.address?.toLowerCase() &&
        ambassadorAddress?.toLowerCase() !== auth?.user?.address?.toLowerCase();

    // We can only edit this Community if: the current User is the one who created OR the current User is an Ambassador for this Community or Council Member
    if (userNotAmbassadorOrCreator && !auth?.user?.councilMember) {
        router.push('/communities');

        return null;
    }

    // If the user has no Currency selected in the Settings, use the Currency based on the selected Country
    const locationWatch = useWatch({ control, name: 'location' });

    console.log(locationWatch);

    useEffect(() => {
        if (!auth?.user?.currency && locationWatch?.country) {
            setCurrency(getCountryCurrency(locationWatch.country) || 'USD');
        }
    }, [locationWatch]);

    useEffect(() => {
        const init = async () => {
            try {
                if (!!community?.contractAddress) {
                    const maxBeneficiaries = await getMaxBeneficiaries(
                        community?.contractAddress
                    );

                    setMaxBeneficiaries(maxBeneficiaries);
                } else {
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

    useEffect(() => {
        setFormFields({
            baseInterval:
                contract?.baseInterval === 17280
                    ? t('day').toLowerCase()
                    : t('week').toLowerCase() || '',
            claimAmount: contract?.claimAmount || '',
            description: community?.description || '',
            incrementInterval: contract?.incrementInterval || 0,
            maxBeneficiaries: maxBeneficiaries || 0,
            maxClaim: contract?.maxClaim || ''
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

    const onSubmit = async (data: any) => {
        try {
            if (communityImage) {
                toggleSubmitting(true);

                let body = {
                    city:
                        data.location?.label
                            ?.substring(
                                0,
                                data.location?.label?.lastIndexOf(',')
                            )
                            ?.trim() || '',
                    contractParams: {
                        baseInterval: frequencyToNumber(data.baseInterval),
                        claimAmount: data.claimAmount.toString(),
                        incrementInterval: data.incrementInterval * 12,
                        maxClaim: data.maxClaim.toString()
                    },
                    country: data.location?.country,
                    coverMediaPath: community?.coverMediaPath,
                    currency,
                    description: data.description,
                    email: data.email,
                    gps: {
                        latitude: data.location?.gps?.lat || 0,
                        longitude: data.location?.gps?.lng || 0
                    },
                    language,
                    name: data.name,
                    placeId: data.location?.value?.place_id || ''
                };

                if (communityImage?.type) {
                    const type = communityImage.type?.split('/')[1] || '';

                    if (type) {
                        const preSigned =
                            await getCommunityPreSigned(type).unwrap();

                        if (preSigned?.uploadURL) {
                            await fetch(preSigned.uploadURL, {
                                body: communityImage,
                                method: 'PUT'
                            });

                            body = {
                                ...body,
                                coverMediaPath: preSigned.filePath
                            };
                        }
                    }
                }

                const result = await editPendingCommunity({
                    body,
                    id: community?.id
                }).unwrap();

                if (result) {
                    toast.success('Community edited successfully!');
                } else {
                    toast.error(<Message id="errorOccurred" />);
                }

                toggleSubmitting(false);
            }
        } catch (error: any) {
            console.log(error);
            toggleSubmitting(false);
            processTransactionError(error, 'edit_pending_community');

            console.log(error.data?.error?.name);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    {/* TODO: missing link to "learn how..." */}
                    <RichText content={submissionContent} g500 mt={0.25} />
                </Box>
                <Box
                    mt={{ sm: 0, xs: 1 }}
                    tAlign={{ sm: 'right', xs: 'left' }}
                    w={{ sm: '25%', xs: '100%' }}
                >
                    <Button
                        disabled={isSubmitting}
                        icon="send"
                        isLoading={isSubmitting}
                        type="submit"
                        w={{ sm: 'auto', xs: '100%' }}
                    >
                        <String id="saveChanges" />
                    </Button>
                </Box>
            </Box>
            <Box mt={4}>
                <CommunityForm
                    communityImage={communityImage}
                    communityStatus={community?.status}
                    control={control}
                    errors={errors}
                    isLoading={isSubmitting}
                    setCommunityImage={setCommunityImage}
                    submitCount={submitCount}
                />
            </Box>
            {!auth?.user?.councilMember && (
                <Box mt={1.25}>
                    <ContractForm
                        control={control}
                        currency={currency}
                        errors={errors}
                        isLoading={isSubmitting}
                        rates={rates}
                    />
                </Box>
            )}
        </form>
    );
};

export default EditPending;
