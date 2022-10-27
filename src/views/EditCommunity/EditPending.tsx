/* eslint-disable max-depth */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Display, toast } from '@impact-market/ui';
import { Community, Contract, useEditPendingCommunityMutation, useGetCommunityPreSignedMutation } from '../../api/community';
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { editCommunitySchema } from '../../utils/communities';
import { frequencyToNumber, frequencyToText } from '@impact-market/utils';
import { getCountryCurrency, getCountryNameFromInitials } from '../../utils/countries';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { toCamelCase } from '../../helpers/toCamelCase';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useYupValidationResolver } from '../../helpers/yup';
import CommunityForm from '../AddCommunity/CommunityForm';
import ContractForm from '../AddCommunity/ContractForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const EditPending: React.FC<{ community: Community, contract: Contract }> = props => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    
    const { community, contract } = props;
    const [isSubmitting, toggleSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(getImage({ filePath: community?.coverMediaPath, fit: 'cover', height: 160, width: 160 })) as any;
    const [currency, setCurrency] = useState(auth?.user?.currency || null);

    const { extractFromView } = usePrismicData({ list: true });
    const { submissionContent, submissionTitle } = extractFromView('heading') as any;

    const router = useRouter();
    const rates = useSelector(selectRates);
    const [editPendingCommunity] = useEditPendingCommunityMutation();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();

    const location = { 
        country: community?.country, 
        gps: { 
            lat: community?.gps?.latitude, 
            lng: community?.gps?.longitude 
        }, 
        label: `${community?.city}, ${getCountryNameFromInitials(community?.country)}`, 
        value: { 
            place_id: community?.placeId
        }
    };

    const { handleSubmit, control, formState: { errors, submitCount } } = useForm({
        defaultValues: {
            baseInterval: frequencyToText(contract?.baseInterval) || '',
            claimAmount: contract?.claimAmount || '',
            description: community?.description || '',
            email: auth?.user?.email || '',
            incrementInterval: (contract?.incrementInterval / 12) || '',
            location: location || null,
            maxClaim: contract?.maxClaim || '',
            name: community?.name || ''
        },
        resolver: useYupValidationResolver(editCommunitySchema)
    });

    // We can only edit this Community if: the current User is the one who created OR the current User is an Ambassador for this Community
    if(community?.requestByAddress?.toLowerCase() !== auth?.user?.address?.toLowerCase() && community?.ambassadorAddress?.toLowerCase() !== auth?.user?.address?.toLowerCase()) {
        router.push('/communities');

        return null;
    }

    // If the user has no Currency selected in the Settings, use the Currency based on the selected Country
    const locationWatch = useWatch({ control, name: 'location' });
        
    useEffect(() => {
        if(!auth?.user?.currency && locationWatch?.country) {
            setCurrency(getCountryCurrency(locationWatch.country) || 'USD');
        }
    }, [locationWatch]);

    // TODO: check if all of this function is correct
    const onSubmit: SubmitHandler<any> = async (data: any) => {
        try {
            if (communityImage) {
                toggleSubmitting(true);

                let body = {
                    city: data.location?.label?.substring(0, data.location?.label?.lastIndexOf(','))?.trim() || '',
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
                    placeId: data.location?.value?.place_id
                };

                if (communityImage?.type) {
                    const type = communityImage.type?.split('/')[1] || '';

                    if (type) {
                        const preSigned = await getCommunityPreSigned(type).unwrap();

                        if (preSigned?.uploadURL) {
                            await fetch(preSigned.uploadURL, {
                                body: communityImage,
                                method: 'PUT'
                            });

                            body = {
                                ...body,
                                coverMediaPath: preSigned.filePath
                            }
                        }
                    }
                }

                const result = await editPendingCommunity({
                    body,
                    id: community?.id
                }).unwrap();

                // TODO: on success, what should we do?
                if (result) {
                    toast.success("Community edited successfully!");
                }
                else {
                    toast.error(<Message id="errorOccurred" />);
                }

                toggleSubmitting(false);
            }
        }
        catch(e: any) {
            console.log(e);
            toggleSubmitting(false);
            
            toast.error(<Message id={toCamelCase(e.data?.error?.name, 'communityForm')} />);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box fLayout="start between" fWrap="wrap" flex>
                <Box column flex pr={{ sm: 2, xs: 0 }} w={{ sm: '75%', xs: '100%' }}>
                    <Display g900 medium>
                        {submissionTitle}
                    </Display>
                    { /* TODO: missing link to "learn how..." */ }
                    <RichText content={submissionContent} g500 mt={0.25} />
                </Box>
                <Box mt={{ sm: 0, xs: 1 }} tAlign={{ sm: 'right', xs: 'left' }} w={{ sm: '25%', xs: '100%' }}>
                    <Button disabled={isSubmitting} icon="send" isLoading={isSubmitting} type="submit" w={{ sm: 'auto', xs: '100%' }}>
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
            <Box mt={1.25}>
                <ContractForm control={control} currency={currency} errors={errors} isLoading={isSubmitting} rates={rates} />
            </Box>
        </form>
    );
};

export default EditPending;
