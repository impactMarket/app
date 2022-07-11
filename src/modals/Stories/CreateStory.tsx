/* eslint-disable max-depth */
import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    Thumbnail,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import {
    useCreateStoryMutation,
    useGetPreSignedMutation
} from '../../api/story';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Input from '../../components/Input';
import React, { useEffect, useRef, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const TEXT_LIMIT = 256;

const CreateStory = () => {
    const [createStory] = useCreateStoryMutation();
    const [imageFiles, setImageFiles] = useState([]);
    const inputRef = useRef<any>();
    const { t } = useTranslations();
    const [getPreSigned] = useGetPreSignedMutation();
    const { handleClose, setRefreshStories } = useModal();
    const { modals } = usePrismicData();
    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });
    const { onChange, onBlur, name, ref } = register('img');

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            let payload: any = {
                message: data.message.trim()
            };

            const emptyDraft = /^\s*$/;

            if (emptyDraft?.test(data.message)) {
                // Add error message?????
                return;
            }

            const images = Array.from(data?.img);

            const uploadedFiles = await Promise.all(images.map(async (file: any) => {
                const type = file?.type?.split('/')[1] || '';
                const preSigned = await getPreSigned(type).unwrap();

                if (!preSigned?.uploadURL) {
                    return null
                }

                await fetch(preSigned?.uploadURL, { body: file, method: 'PUT' });

                return preSigned.filePath;
            }));

            const storyMedia = uploadedFiles.reduce((result, item) => item ? [...result, item] : result, []);

            payload = {
                ...payload,
                storyMedia
            };

            const postRequest: any = await createStory(payload);

            if(postRequest?.error) {
                toast.error(<RichText content={modals.data.createStoryError}/>);
            } else {
                toast.success(<RichText content={modals.data.createStorySuccess}/>);
            }

            setRefreshStories((refreshStory: boolean) => !refreshStory);
            handleClose();
        } catch (error) {
            toast.error(<RichText content={modals.data.createStoryError}/>);
            console.log(error);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const handleCancel = (event: any) => {
        event.preventDefault();

        return handleClose();
    };

    const preventDefault = (event: any) => {
        event.preventDefault();
    };

    const handleInputChange = (event: any) => {
        const { files } = event?.target || {};
        const imagesArray = []

        for (let i = 0; i < files?.length; i++) {
            imagesArray?.push(files[i])
        }

        imagesArray?.map(image => {
            const imgUrl = URL.createObjectURL(image);

            return setImageFiles(imageFiles => [...imageFiles, imgUrl]);
        })
    };

    const handleClick = () => {
        if (typeof inputRef?.current?.click === 'function') {
            inputRef.current.click();
        }
    };

    const clearFile = (image: any) => {
        inputRef.current.value = '';
        //  Remove image from array
        setImageFiles(imageFile => imageFile.filter(imageUrl => imageUrl !== image ))
    };

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="flash" large />
            <RichText
                content={modals.data.createStoryTitle}
                large
                mt={1.25}
                semibold
            />
            <RichText
                content={modals.data.createStoryContent}
                g500
                mt={0.5}
                small
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={1.25}>
                    <Input
                        control={control}
                        hint={errors?.message ? t('requiredField') : ''}
                        label={t('storyPostText')}
                        limit={TEXT_LIMIT}
                        name="message"
                        placeholder={t('writeSomethingHere')}
                        rows={6}
                        rules={{ required: true }}
                        withError={errors?.message}
                    />
                </Box>
                <>
                    <Button
                        fluid="xs"
                        icon="image"
                        mt={1}
                        onClick={(event: any) => {
                            preventDefault(event);
                            handleClick();
                        }}
                        secondary
                    >
                        <String id="selectImage" />
                    </Button>

                    <input
                        accept="image/*"
                        id="img"
                        multiple
                        name={name}
                        onBlur={onBlur}
                        onChange={(event: any) => {
                            handleInputChange(event);
                            onChange(event);
                        }}
                        ref={(e) => {
                            ref(e);
                            inputRef.current = e;
                        }}
                        style={{ display: 'none' }}
                        type="file"
                    />

                    {!!imageFiles?.length && (
                        <Row fLayout="center">
                            {imageFiles?.map((image, key) => (
                                <Box key={key} mt={1}>
                                    <Thumbnail
                                        handleClick={(event: any) => {
                                            preventDefault(event);
                                            clearFile(image);
                                        }}
                                        icon="trash"
                                        url={image}
                                    />
                                </Box>
                            ))}
                        </Row>
                    )}
                </>
                <Row mt={1}>
                    <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                        <Button gray onClick={handleCancel} w="100%">
                            <RichText
                                content={
                                    modals.data.createStoryCancelButtonLabel
                                }
                            />
                        </Button>
                    </Col>

                    <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                        <Button isLoading={isSubmitting} type="submit" w="100%">
                            <RichText
                                content={
                                    modals.data.createStoryConfirmButtonLabel
                                }
                            />
                        </Button>
                    </Col>
                </Row>
            </form>
        </ModalWrapper>
    );
};

export default CreateStory;
