import { handleSignature } from '../../helpers/handleSignature';
import { selectCurrentUser } from '../../state/slices/auth';
import { toast } from '@impact-market/ui';
import {
    useEditPendingCommunityMutation,
    useEditValidCommunityMutation,
    useGetCommunityPreSignedMutation
} from '../../api/community';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useSignatures } from '@impact-market/utils/useSignatures';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import CommunityForm from '../AddCommunity/CommunityForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect } from 'react';

const schema = yup.object().shape({
    description: yup.string().min(240).max(2048).required(),
    name: yup.string().required()
});

const CommunityDetailsForm = ({
    community,
    formData,
    communityImage,
    setCommunityImage,
    submitCount
}: any) => {
    const [editValidCommunity] = useEditValidCommunityMutation();
    const [editPendingCommunity] = useEditPendingCommunityMutation();
    const { signature } = useSelector(selectCurrentUser);
    const { signMessage } = useSignatures();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();

    const {
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: formData,
        resolver: useYupValidationResolver(schema)
    });

    const { isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(getValues());
        }
    }, [isSubmitSuccessful]);

    const submit = async (data: any) => {
        try {
            let res;

            let body = {
                coverMediaPath: community?.coverMediaPath,
                description: data?.description || '',
                name: data.name || ''
            };

            if (!signature) {
                await handleSignature(signMessage);
            }

            if (communityImage?.type) {
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

                        body = {
                            ...body,
                            coverMediaPath: preSigned.filePath
                        };
                    }
                }
            }

            if (!!community.contractAddress) {
                res = await editValidCommunity({
                    body,
                    id: community.id
                });
            } else {
                const pendingCommunityBody = {
                    ...body,
                    gps: {
                        latitude: data?.location?.gps?.lat || 0,
                        longitude: data?.location?.gps?.lng || 0
                    }
                };

                res = (await editPendingCommunity({
                    body: pendingCommunityBody,
                    id: community.id
                }).unwrap()) as any;
            }

            if (!!res.error) {
                toast.error(<Message id="errorOccurred" />);
            } else {
                toast.success(<Message id="successfullyChangedData" />);
            }
        } catch (error: any) {
            console.log(error);
            if (
                error?.data?.error?.name === 'EXPIRED_SIGNATURE' ||
                error?.data?.error?.name === 'INVALID_SINATURE'
            ) {
                await handleSignature(signMessage);

                submit(data);
            } else {
                toast.error(<Message id="errorOccurred" />);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)}>
            <CommunityForm
                communityImage={communityImage}
                communityStatus={community?.status}
                control={control}
                errors={errors}
                isLoading={isSubmitting}
                reset={() => reset(formData)}
                save
                setCommunityImage={setCommunityImage}
                submitCount={submitCount}
            />
        </form>
    );
};

export default CommunityDetailsForm;
