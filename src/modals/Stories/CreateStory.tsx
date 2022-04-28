import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
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

type Inputs = {
    img?: string;
    message: string;
};

const TEXT_LIMIT = 256;

const CreateStory = () => {
    const [createStory] = useCreateStoryMutation();
    const [file, setFile] = useState<string>('');
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
        formState: {}
    } = useForm<Inputs>();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });
    const { onChange, onBlur, name, ref } = register('img');

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            let payload: any = {
                message: data.message
            };

            if (data?.img?.length > 0) {
                const type = data.img[0].type?.split('/')[1] || '';

                if (type) {
                    const preSigned = await getPreSigned(type).unwrap();

                    if (preSigned?.uploadURL) {
                        await fetch(preSigned.uploadURL, {
                            body: data.img[0],
                            method: 'PUT'
                        });

                        payload = {
                            ...payload,
                            storyMediaPath: preSigned.filePath
                        };
                    }
                }
            }

            await createStory(payload);
            setRefreshStories((refreshStory: boolean) => !refreshStory);
            handleClose();
        } catch (e) {
            console.log(e);
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
        const [fileObj] = files;
        const imgUrl = URL.createObjectURL(fileObj);

        return setFile(imgUrl);
    };

    const handleClick = () => {
        if (typeof inputRef?.current?.click === 'function') {
            inputRef.current.click();
        }
    };

    const clearFile = () => {
        inputRef.current.value = '';
        setFile('');
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
                        label={t('storyPostText')}
                        limit={TEXT_LIMIT}
                        name="message"
                        placeholder="Write something here..."
                        rows={6}
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

                    {file !== '' && (
                        <Row fLayout="center">
                            <Col>
                                <Box h={5.25} mt={1} w={5.25}>
                                    <img
                                        alt=""
                                        src={file}
                                        style={{
                                            borderRadius: '8px',
                                            height: '100%',
                                            width: '100%'
                                        }}
                                    />
                                </Box>
                                <Button
                                    gray
                                    icon="trash"
                                    mt={1}
                                    onClick={(event: any) => {
                                        preventDefault(event);
                                        clearFile();
                                    }}
                                />
                            </Col>
                        </Row>
                    )}
                </>
                <Row mt={1}>
                    <Col colSize={{ sm: 6, xs: 12 }}>
                        <Button gray onClick={handleCancel} w="100%">
                            <RichText
                                content={
                                    modals.data.createStoryCancelButtonLabel
                                }
                            />
                        </Button>
                    </Col>

                    <Col colSize={{ sm: 6, xs: 12 }}>
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
