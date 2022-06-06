/* eslint-disable max-depth */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Display, ViewContainer, openModal, toast } from '@impact-market/ui';
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { convertCurrency } from '../../utils/currencies';
import { frequencyToNumber } from '@impact-market/utils';
import { getCountryCurrency } from '../../utils/countries';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { toCamelCase } from '../../helpers/toCamelCase';
import { useCreateCommunityMutation, useGetCommunityPreSignedMutation } from '../../api/community';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import CommunityForm from './CommunityForm';
import ContractForm from './ContractForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

// TODO: once we have a solution for InputUpload form value being filled and not null, un-comment the line below
const schema = yup.object().shape({
    baseInterval: yup.string().required(),
    claimAmount: yup.number().required().positive().min(0),
    // coverImg: yup.mixed().required(),
    description: yup.string().required(),
    incrementInterval: yup.number().required().positive().integer().min(0),
    location: yup.mixed().required(),
    maxClaim: yup.number().required().positive().min(0),
    name: yup.string().required()
});

const AddCommunity: React.FC<{ isLoading?: boolean }> = props => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';

    const { isLoading } = props;
    const [isSubmitting, toggleSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [currency, setCurrency] = useState(auth?.user?.currency || null);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const router = useRouter();
    const rates = useSelector(selectRates);
    const dispatch = useDispatch();
    const [createCommunity] = useCreateCommunityMutation();
    const [getUserPreSigned] = useGetPreSignedMutation();
    const [updateUser] = useUpdateUserMutation();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();

    const { handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            baseInterval: '',
            claimAmount: '',
            description: '',
            incrementInterval: '',
            location: null,
            maxClaim: '',
            name: ''
        },
        resolver: useYupValidationResolver(schema)
    });

    // Must have a login (and address) to create a Community
    if(!auth?.user?.address) {
        router.push('/');

        return null;
    }

    // If the user has no Currency selected in the Settings, use the Currency based on the selected Country
    const locationWatch = useWatch({ control, name: 'location' });
        
    useEffect(() => {
        if(!auth?.user?.currency && locationWatch?.country) {
            setCurrency(getCountryCurrency(locationWatch.country) || 'USD');
        }
    }, [locationWatch]);

    const openSubmitModal: SubmitHandler<any> = (data) => {
        openModal('confirmAddCommunity', { currency, data, isSubmitting, language, onSubmit });
    };

    // TODO: check if all of this function is correct
    // TODO: what happens if the user doesn't have any email yet?
    /*
    * TODO: check if this separation for city/country is correct
    * Porto, Portugal » City: Porto / Country: Portugal
    * Las Vegas, NV, EUA » City: Las Vegas, NV / Country: EUA
    */
    const onSubmit = async (data: any) => {
        try {
            toggleSubmitting(true);

            // User uploaded a photo for his profile
            if (profileImage) {
                const type = profileImage.type?.split('/')[1] || '';

                if (type) {
                    const preSigned = await getUserPreSigned(type).unwrap();

                    if (preSigned?.uploadURL) {
                        const result = await fetch(preSigned.uploadURL, {
                            body: profileImage,
                            method: 'PUT'
                        });

                        if (result?.status === 200) {
                            const userImage = await updateUser({
                                avatarMediaPath: preSigned.filePath
                            }).unwrap();

                            if (userImage) {
                                dispatch(setUser({ user: { ...userImage }}));
                            }
                        }
                    }
                }
            }

            let { claimAmount, maxClaim } = data;

            // If the currency is different than USD, convert to USD before adding the 0's
            if (currency != 'USD') {
                claimAmount = convertCurrency(data.claimAmount, rates, currency, 'USD');
                maxClaim = convertCurrency(data.maxClaim, rates, currency, 'USD');
            }

            claimAmount *= 1000000000000000000;
            maxClaim *= 1000000000000000000;

            const payload = {
                city: data.location?.label?.substring(0, data.location?.label?.lastIndexOf(','))?.trim() || '',
                contractParams: {
                    baseInterval: frequencyToNumber(data.baseInterval),
                    claimAmount,
                    incrementInterval: data.incrementInterval * 12,
                    maxClaim
                },
                country: data.location?.label?.substring(data.location?.label?.lastIndexOf(',') + 1)?.trim() || '',
                coverMediaPath: '',
                currency,
                description: data.description,
                email: auth?.user?.email,
                gps: {
                    latitude: data.location?.gps?.lat || 0,
                    longitude: data.location?.gps?.lng || 0
                },
                language,
                name: data.name,
                requestByAddress: auth?.user?.address
            };

            if (communityImage) {
                const type = communityImage.type?.split('/')[1] || '';

                if (type) {
                    const preSigned = await getCommunityPreSigned(type).unwrap();

                    if (preSigned?.uploadURL) {
                        await fetch(preSigned.uploadURL, {
                            body: communityImage,
                            method: 'PUT'
                        });

                        const result = await createCommunity({
                            ...payload,
                            coverMediaPath: preSigned.filePath
                        }).unwrap();

                        // TODO: on success, what should we do?
                        if (result) {
                            toast.success("Community added successfully!");

                            reset();
                            setCommunityImage(null);
                            setProfileImage(null);
                        }
                        else {
                            toast.error(<Message id="errorOccurred" />);
                        }
                    }
                }
            }

            toggleSubmitting(false);
        }
        catch(e: any) {
            console.log(e);
            toggleSubmitting(false);

            // TODO: add error codes and texts to Prismic (for now we only have ALREADY_HAS_COMMUNITY)
            toast.error(<Message id={toCamelCase(e.data?.error?.name)} />);
        }
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <form onSubmit={handleSubmit(openSubmitModal)}>
                <Box fLayout="start between" fWrap="wrap" flex>
                    <Box column flex pr={{ sm: 2, xs: 0 }} w={{ sm: '80%', xs: '100%' }}>
                        <Display g900 medium>
                            {title}
                        </Display>
                        { /* TODO: missing link to "learn how..." */ }
                        <RichText content={content} g500 mt={0.25} />
                    </Box>
                    <Box mt={{ sm: 0, xs: 1 }} tAlign={{ sm: 'right', xs: 'left' }} w={{ sm: '20%', xs: '100%' }}>
                        <Button disabled={isSubmitting} icon="send" isLoading={isSubmitting} type="submit" w={{ sm: 'auto', xs: '100%' }}>
                            <String id="submit" />
                        </Button>
                    </Box>
                </Box>
                <Box mt={4}>
                    <CommunityForm 
                        communityImage={communityImage} 
                        control={control} 
                        errors={errors} 
                        isLoading={isSubmitting}
                        profileImage={profileImage} 
                        setCommunityImage={setCommunityImage} 
                        setProfileImage={setProfileImage} 
                        userImage={auth?.user?.avatarMediaPath} 
                    />
                </Box>
                <Box mt={1.25}>
                    <ContractForm control={control} currency={currency} errors={errors} isLoading={isSubmitting} />
                </Box>
            </form>
        </ViewContainer>
    );
};

export default AddCommunity;
