/* eslint-disable max-depth */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Display, ViewContainer, openModal, toast } from '@impact-market/ui';
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { emailRegExp } from '../../helpers/regex';
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
import PersonalForm from './PersonalForm';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

// TODO: once we have a solution for InputUpload form value being filled and not null, un-comment the line below
const schema = yup.object().shape({
    baseInterval: yup.string().required(),
    claimAmount: yup.number().required().positive().min(0),
    // coverImg: yup.mixed().required(),
    description: yup.string().required(),
    email: yup.string().required().matches(emailRegExp).email(),
    firstName: yup.string().required().max(30),
    incrementInterval: yup.number().required().positive().integer().min(0),
    lastName: yup.string().required().max(30),
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
            email: auth?.user?.email || '',
            firstName: auth?.user?.firstName || '',
            incrementInterval: '',
            lastName: auth?.user?.lastName || '',
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
    const onSubmit = async (data: any) => {
        try {
            toggleSubmitting(true);

            // User filled his Personal info
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
                            const userResult = await updateUser({
                                avatarMediaPath: preSigned.filePath,
                                email: data.email,
                                firstName: data.firstName,
                                lastName: data.lastName
                            }).unwrap();

                            if (userResult) {
                                dispatch(setUser({ user: { ...userResult }}));
                            }
                        }
                    }
                }
            }

            const payload = {
                city: data.location?.label?.substring(0, data.location?.label?.lastIndexOf(','))?.trim() || '',
                contractParams: {
                    baseInterval: frequencyToNumber(data.baseInterval),
                    claimAmount: (data.claimAmount * 1000000000000000000).toString(),
                    incrementInterval: data.incrementInterval * 12,
                    maxClaim: (data.maxClaim * 1000000000000000000).toString()
                },
                country: data.location?.country,
                coverMediaPath: '',
                currency,
                description: data.description,
                email: data.email,
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
                        setCommunityImage={setCommunityImage} 
                    />
                </Box>
                {
                    (!auth?.user?.email || !auth?.user?.avatarMediaPath || !auth?.user?.firstName || !auth?.user?.lastName) &&
                    <Box mt={1.25}>
                        <PersonalForm 
                            control={control} 
                            errors={errors} 
                            isLoading={isSubmitting}
                            profileImage={profileImage} 
                            setProfileImage={setProfileImage} 
                            user={auth?.user}
                        />
                    </Box>
                }
                <Box mt={1.25}>
                    <ContractForm control={control} currency={currency} errors={errors} isLoading={isSubmitting} rates={rates} />
                </Box>
            </form>
        </ViewContainer>
    );
};

export default AddCommunity;