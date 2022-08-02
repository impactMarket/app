/* eslint-disable max-depth */
/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, Box, Button, Display, ViewContainer, openModal, toast } from '@impact-market/ui';
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { addCommunitySchema } from '../../utils/communities';
import { frequencyToNumber } from '@impact-market/utils';
import { getCountryCurrency } from '../../utils/countries';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { toCamelCase } from '../../helpers/toCamelCase';
import { useCreateCommunityMutation, useGetCommunityPreSignedMutation } from '../../api/community';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
import { useLocalStorage } from '../../hooks/useStorage';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useYupValidationResolver } from '../../helpers/yup';
import CommunityForm from './CommunityForm';
import ContractForm from './ContractForm';
import Message from '../../libs/Prismic/components/Message';
import PersonalForm from './PersonalForm';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const AddCommunity: React.FC<{ isLoading?: boolean }> = props => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';

    const { isLoading } = props;
    const [isReady, setIsReady] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [currency, setCurrency] = useState(auth?.user?.currency || null);

    const { extractFromView } = usePrismicData();
    const { alert, title, content } = extractFromView('heading') as any;

    const router = useRouter();
    const rates = useSelector(selectRates);
    const dispatch = useDispatch();
    const [createCommunity] = useCreateCommunityMutation();
    const [getUserPreSigned] = useGetPreSignedMutation();
    const [updateUser] = useUpdateUserMutation();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();
    const [addCommunityInfo, setAddCommunityInfo, removeAddCommunityInfo] = useLocalStorage('add-community-info', undefined);
    const unsavedChanges = addCommunityInfo?.address === auth?.user?.address ? addCommunityInfo : null;

    const { handleSubmit, control, formState: { errors, submitCount }, getValues, reset, setValue } = useForm({
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
        resolver: useYupValidationResolver(addCommunitySchema)
    });
    const inputWatch = useWatch({ control });

    // Must have a login (and address) to create a Community
    if(!auth?.user?.address) {
        router.push('/');

        return null;
    }

    // On start, check if there is any saved info to load (only loads if there's at least one field not empty)
    useEffect(() => {
        if(
            unsavedChanges &&
            (
                !!unsavedChanges?.baseInterval ||
                !!unsavedChanges?.claimAmount ||
                !!unsavedChanges?.description ||
                (!!unsavedChanges?.email && !auth?.user?.email) ||
                (!!unsavedChanges?.firstName && !auth?.user?.firstName) ||
                !!unsavedChanges?.incrementInterval ||
                (!!unsavedChanges?.lastName && !auth?.user?.lastName) ||
                !!unsavedChanges?.location ||
                !!unsavedChanges?.maxClaim ||
                !!unsavedChanges?.name
            )
        ) {
            openModal('reloadInfoAddCommunity', { reloadInfo });
        }

        setIsReady(true);
    }, []);

    const reloadInfo = () => {
        setValue('baseInterval', unsavedChanges?.baseInterval);
        setValue('claimAmount', unsavedChanges?.claimAmount);
        setValue('description', unsavedChanges?.description);
        setValue('email', unsavedChanges?.email);
        setValue('firstName', unsavedChanges?.firstName);
        setValue('incrementInterval', unsavedChanges?.incrementInterval);
        setValue('lastName', unsavedChanges?.lastName);
        setValue('location', unsavedChanges?.location);
        setValue('maxClaim', unsavedChanges?.maxClaim);
        setValue('name', unsavedChanges?.name);
    }

    // If the user has no Currency selected in the Settings, use the Currency based on the selected Country
    useEffect(() => {
        if(!auth?.user?.currency && inputWatch?.location?.country) {
            setCurrency(getCountryCurrency(inputWatch.location.country) || 'USD');
        }
    }, [inputWatch?.location]);

    // When changing any input, save everything to localStorage
    useEffect(() => {
        if(isReady) {
            setAddCommunityInfo({ address: auth?.user?.address, ...getValues() });
        }
    }, [inputWatch]);

    // Open confirmModal on form submit
    const openSubmitModal: SubmitHandler<any> = (data) => {
        if(!!communityImage && (!!profileImage || !!auth?.user?.avatarMediaPath)) {
            openModal('confirmAddCommunity', { data, isSubmitting, language, onSubmit });
        }
    };

    // TODO: check if all of this function is correct
    const onSubmit = async (data: any) => {
        try {
            setSubmitting(true);

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
                    claimAmount: data.claimAmount.toString(),
                    incrementInterval: data.incrementInterval * 12,
                    maxClaim: data.maxClaim.toString()
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
                placeId: data.location?.value?.place_id,
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

                        // TODO: on success, what should we do? (perhaps redirect to the /mycommunity page)
                        if (result) {
                            toast.success("Community added successfully!");

                            reset();
                            setCommunityImage(null);
                            setProfileImage(null);
                            removeAddCommunityInfo();
                        }
                        else {
                            toast.error(<Message id="errorOccurred" />);
                        }
                    }
                }
            }

            setSubmitting(false);
        }
        catch(e: any) {
            console.log(e);
            setSubmitting(false);

            toast.error(<Message id={toCamelCase(e.data?.error?.name, 'communityForm')} />);
        }
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <form onSubmit={handleSubmit(openSubmitModal)}>
                <Alert
                    icon="alertCircle"
                    title={<RichText content={alert} />}
                    warning
                />
                <Box fLayout="start between" fWrap="wrap" flex mt={2}>
                    <Box column flex pr={{ sm: 2, xs: 0 }} w={{ sm: '75%', xs: '100%' }}>
                        <Display g900 medium>
                            {title}
                        </Display>
                        { /* TODO: missing link to "learn how..." */ }
                        <RichText content={content} g500 mt={0.25} />
                    </Box>
                    <Box mt={{ sm: 0, xs: 1 }} tAlign={{ sm: 'right', xs: 'left' }} w={{ sm: '25%', xs: '100%' }}>
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
                        submitCount={submitCount}
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
                            submitCount={submitCount}
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
