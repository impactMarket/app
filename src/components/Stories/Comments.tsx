import * as Sentry from '@sentry/browser';
import {
    Avatar,
    Box,
    Button,
    Col,
    Input,
    Row,
    Text,
    toast
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePostCommentMutation } from '../../api/story';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSWRConfig } from 'swr';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const TEXT_LIMIT = 256;

const Comments = (props: any) => {
    const { comments, openNewComment, setOpenNewComment, story } = props;
    const { t } = useTranslations();
    const { modals } = usePrismicData();
    const auth = useSelector(selectCurrentUser);
    const { mutate } = useSWRConfig();

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
        reset
    } = useForm();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });

    const [postComment] = usePostCommentMutation();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            //  If comment is only spaces (no characters) show error
            if (data?.comment?.trim().length === 0) {
                toast.error(t('writeValidComment'));
            } else {
                const postRequest: any = await postComment({
                    body: {
                        comment: data?.comment
                    },
                    id: story?.id,
                    token: auth?.token
                });

                if (postRequest?.error) {
                    toast.error(t('maximumCharactersExceeded'));
                } else {
                    mutate(`/stories/${story?.id}/comments`);
                    toast.success(t('commentAdded'));
                    setOpenNewComment(false);
                }
            }
        } catch (error) {
            toast.error(t('error'));
            console.log(error);
            Sentry.captureException(error);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const handleCancel = (event: any) => {
        event.preventDefault();
        setOpenNewComment(false);
    };

    const [characters, setCharacters] = useState(TEXT_LIMIT.toString());

    const handleChange = (e: any) => {
        e.target.value.length < TEXT_LIMIT
            ? setCharacters((TEXT_LIMIT - e.target.value.length).toString())
            : setCharacters('0');
    };

    return (
        <>
            {openNewComment && (
                <Box>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box mt={1.25}>
                            <Input
                                control={control}
                                hint={
                                    errors?.message
                                        ? t('requiredField')
                                        : t('countCharactersLeft', {
                                              count: characters
                                          })
                                }
                                placeholder={t('writeComment')}
                                rows={3}
                                rules={{ required: true }}
                                withError={errors?.message}
                                {...register('comment', { required: true })}
                                limit={TEXT_LIMIT}
                                onChange={handleChange}
                            />
                        </Box>

                        <Row mt={0}>
                            <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                                <Button gray onClick={handleCancel} w="100%">
                                    <RichText
                                        content={
                                            modals?.data
                                                ?.createStoryCancelButtonLabel
                                        }
                                    />
                                </Button>
                            </Col>

                            <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                                <Button
                                    isLoading={isSubmitting}
                                    type="submit"
                                    w="100%"
                                >
                                    <RichText content={t('comment')} />
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </Box>
            )}
            <Box
                fDirection="column"
                fLayout="start"
                flex
                mt={1.5}
                overflow={{ phone: 'unset', tablet: 'auto' }}
            >
                {comments?.rows?.map((comment: any, key: number) => (
                    <Box fLayout="center" flex inlineFlex key={key} mb={1}>
                        <Avatar
                            extrasmall
                            url={getImage({
                                filePath: comment?.user?.avatarMediaPath,
                                fit: 'cover'
                            })}
                        />
                        <Box ml={0.5}>
                            <Text g700 semibold small>
                                {`${
                                    comment?.user?.firstName
                                        ? comment?.user?.firstName
                                        : 'Unidentified User'
                                } ${
                                    comment?.user?.lastName
                                        ? comment?.user?.lastName
                                        : ''
                                }`}
                            </Text>
                            <Box>
                                <Text g500 regular small>
                                    {comment?.comment}
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default Comments;
