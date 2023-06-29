/* eslint-disable max-depth */
/* eslint-disable react-hooks/rules-of-hooks */
import {
    Alert,
    Box,
    Button,
    Display,
    ViewContainer,
    openModal,
    toast
} from '@impact-market/ui';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { addCommunitySchema } from '../../utils/communities';
import { frequencyToNumber } from '@impact-market/utils';
import { getCountryCurrency } from '../../utils/countries';
import { selectCurrentUser, setUser } from '../../state/slices/auth';
import { selectRates } from '../../state/slices/rates';
import { toCamelCase } from '../../helpers/toCamelCase';
import {
    useCreateCommunityMutation,
    useGetCommunityPreSignedMutation
} from '../../api/community';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPreSignedMutation, useUpdateUserMutation } from '../../api/user';
import { useLocalStorage } from '../../hooks/useStorage';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useYupValidationResolver } from '../../helpers/yup';
import CommunityForm from './CommunityForm';
import ContractForm from './ContractForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useWallet from '../../hooks/useWallet';

const AddCommunity: React.FC<{ isLoading?: boolean }> = (props) => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const { connect } = useWallet();

    const { isLoading } = props;
    const [isReady, setIsReady] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(null);
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
    const [addCommunityInfo, setAddCommunityInfo, removeAddCommunityInfo] =
        useLocalStorage('add-community-info', undefined);
    const unsavedChanges =
        addCommunityInfo?.address === auth?.user?.address
            ? addCommunityInfo
            : null;

    const {
        handleSubmit,
        control,
        formState: { errors, submitCount },
        getValues,
        reset,
        setValue
    } = useForm({
        defaultValues: {
            baseInterval: '',
            claimAmount: '',
            description: '',
            incrementInterval: '',
            location: null,
            maxClaim: '',
            name: ''
        },
        resolver: useYupValidationResolver(addCommunitySchema)
    });
    const inputWatch = useWatch({ control });

    // On start, check if there is any saved info to load (only loads if there's at least one field not empty)
    useEffect(() => {
        if (
            unsavedChanges &&
            (!!unsavedChanges?.baseInterval ||
                !!unsavedChanges?.claimAmount ||
                !!unsavedChanges?.description ||
                !!unsavedChanges?.incrementInterval ||
                !!unsavedChanges?.location ||
                !!unsavedChanges?.maxClaim ||
                !!unsavedChanges?.name)
        ) {
            openModal('reloadInfoAddCommunity', { reloadInfo });
        }

        setIsReady(true);
    }, []);

    const reloadInfo = () => {
        setValue('baseInterval', unsavedChanges?.baseInterval);
        setValue('claimAmount', unsavedChanges?.claimAmount);
        setValue('description', unsavedChanges?.description);
        setValue('incrementInterval', unsavedChanges?.incrementInterval);
        setValue('location', unsavedChanges?.location);
        setValue('maxClaim', unsavedChanges?.maxClaim);
        setValue('name', unsavedChanges?.name);
    };

    // If the user has no Currency selected in the Settings, use the Currency based on the selected Country
    useEffect(() => {
        if (!auth?.user?.currency && inputWatch?.location?.country) {
            setCurrency(
                getCountryCurrency(inputWatch.location.country) || 'USD'
            );
        }
    }, [inputWatch?.location]);

    // When changing any input, save everything to localStorage
    useEffect(() => {
        if (isReady) {
            setAddCommunityInfo({
                address: auth?.user?.address,
                ...getValues()
            });
        }
    }, [inputWatch]);

    // Open confirmModal on form submit
    const openSubmitModal: SubmitHandler<any> = async (data) => {
        if (!!communityImage) {
            if (!auth?.user) {
                try {
                    await connect();
                } catch (error) {
                    console.log(error);
                }
            }

            if (auth?.user) {
                openModal('confirmAddCommunity', {
                    data,
                    isSubmitting,
                    language,
                    onSubmit
                });
            }
        }
    };

    const updateUserDetails = async (data: any, updatedProfilePicture: any) => {
        return await updateUser({
            avatarMediaPath: updatedProfilePicture?.filePath
                ? updatedProfilePicture?.filePath
                : auth?.user?.avatarMediaPath,
            email: data.email ? data.email : auth?.user?.email,
            firstName: data.firstName ? data.firstName : auth?.user?.firstName,
            lastName: data.lastName ? data.lastName : auth?.user?.lastName
        }).unwrap();
    };

    const onSubmit = async (
        data: any,
        submitAuth: any,
        profilePicture: any
    ) => {
        try {
            setSubmitting(true);

            // Add user (If User filled his Personal info)
            if (
                data?.firstName ||
                data?.lastName ||
                data?.email ||
                profilePicture
            ) {
                const image = profilePicture?.type?.split('/')[1] || '';
                let updatedProfilePicture;

                if (image) {
                    const preSigned = await getUserPreSigned(image).unwrap();

                    if (preSigned?.uploadURL) {
                        const result = await fetch(preSigned.uploadURL, {
                            body: profilePicture,
                            method: 'PUT'
                        });

                        if (result?.status === 200) {
                            updatedProfilePicture = preSigned;
                        }
                    }
                }

                try {
                    const userResult = await updateUserDetails(
                        data,
                        updatedProfilePicture
                    );

                    if (userResult) {
                        dispatch(setUser({ user: { ...userResult } }));
                    }
                } catch (error: any) {
                    console.log(error);
                    toast.error(<Message id="errorOccurred" />);
                }
            }

            // Get city from City,Country dropdown
            let city;

            if (data.location?.label?.includes('-')) {
                city = data.location?.label?.lastIndexOf('-');
            }
            if (data.location?.label?.includes(',')) {
                city = data.location?.label?.lastIndexOf(',');
            }

            // Add Community
            const payload = {
                city:
                    data.location?.label?.substring(0, city)?.trim() ||
                    data.location?.label,
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
                email: submitAuth?.user?.email || data.email,
                gps: {
                    latitude: data.location?.gps?.lat || 0,
                    longitude: data.location?.gps?.lng || 0
                },
                language,
                name: data.name,
                placeId: data.location?.value?.place_id,
                requestByAddress: submitAuth?.user?.address || data?.address
            };

            if (communityImage) {
                const type = communityImage.type?.split('/')[1] || '';

                if (type) {
                    const preSigned = await getCommunityPreSigned(
                        type
                    ).unwrap();

                    if (preSigned?.uploadURL) {
                        await fetch(preSigned.uploadURL, {
                            body: communityImage,
                            method: 'PUT'
                        });

                        const result = await createCommunity({
                            ...payload,
                            coverMediaPath: preSigned.filePath
                        }).unwrap();

                        if (result) {
                            toast.success('Community added successfully!');
                            router.push('/');

                            reset();
                            setCommunityImage(null);
                            removeAddCommunityInfo();
                        } else {
                            toast.error(<Message id="errorOccurred" />);
                        }
                    }
                }
            }

            setSubmitting(false);
        } catch (e: any) {
            console.log(e);
            setSubmitting(false);

            toast.error(
                <Message
                    id={toCamelCase(e.data?.error?.name, 'communityForm')}
                />
            );
        }
    };

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <form onSubmit={handleSubmit(openSubmitModal)}>
                <Alert
                    icon="alertCircle"
                    title={<RichText content={alert} />}
                    warning
                />
                <Box fLayout="start between" fWrap="wrap" flex mt={2}>
                    <Box
                        column
                        flex
                        pr={{ sm: 2, xs: 0 }}
                        w={{ sm: '75%', xs: '100%' }}
                    >
                        <Display g900 medium>
                            {title}
                        </Display>
                        {/* TODO: missing link to "learn how..." */}
                        <RichText content={content} g500 mt={0.25} />
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
                            {auth?.user ? (
                                <String id="submit" />
                            ) : (
                                <String id="connectWallet" />
                            )}
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
                <Box mt={1.25}>
                    <ContractForm
                        control={control}
                        currency={currency}
                        errors={errors}
                        isLoading={isSubmitting}
                        rates={rates}
                    />
                </Box>
            </form>
        </ViewContainer>
    );
};

export default AddCommunity;
