/* eslint-disable max-depth */
import { Box, Button, Display, openModal, toast } from '@impact-market/ui';
import { Community, useEditValidCommunityMutation, useGetCommunityPreSignedMutation } from '../../api/community';
import { SubmitHandler, useForm } from "react-hook-form";
import { editValidCommunitySchema } from '../../utils/communities';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { toCamelCase } from '../../helpers/toCamelCase';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useYupValidationResolver } from '../../helpers/yup';
import CommunityForm from '../AddCommunity/CommunityForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const EditCommunity: React.FC<{ community: Community }> = props => {
    const { community } = props;
    const [isSubmitting, toggleSubmitting] = useState(false);
    const [communityImage, setCommunityImage] = useState(getImage({ filePath: community?.coverMediaPath, fit: 'cover', height: 160, width: 160 })) as any;

    const { extractFromView } = usePrismicData();
    const { communityContent, communityTitle } = extractFromView('heading') as any;

    const router = useRouter();
    const auth = useSelector(selectCurrentUser);
    const [editValidCommunity] = useEditValidCommunityMutation();
    const [getCommunityPreSigned] = useGetCommunityPreSignedMutation();

    const { handleSubmit, control, formState: { errors, submitCount } } = useForm({
        defaultValues: {
            description: community?.description || '',
            name: community?.name || ''
        },
        resolver: useYupValidationResolver(editValidCommunitySchema)
    });

    // We can only edit this Community if the current User is a manager of this Community
    if(community?.contractAddress?.toLowerCase() !== auth?.user?.manager?.community?.toLowerCase()) {
        router.push('/communities');

        return null;
    }

    const onSubmit: SubmitHandler<any> = async (data: any) => {
        try {
            if (communityImage) {
                toggleSubmitting(true);

                let body = {
                    coverMediaPath: community?.coverMediaPath,
                    description: data.description,
                    name: data.name
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

                const result = await editValidCommunity({
                    body,
                    id: community.id
                }).unwrap();

                // TODO: on success, what should we do?
                if (result) {
                    openModal('communityEdited');
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
                        {communityTitle}
                    </Display>
                    <RichText content={communityContent} g500 mt={0.25} />
                </Box>
                <Box mt={{ sm: 0, xs: 1 }} tAlign={{ sm: 'right', xs: 'left' }} w={{ sm: '25%', xs: '100%' }}>
                    <Button disabled={isSubmitting} icon="send" isLoading={isSubmitting} type="submit" w={{ sm: 'auto', xs: '100%' }}>
                        <String id="sendToReview" />
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
        </form>
    );
};

export default EditCommunity;
