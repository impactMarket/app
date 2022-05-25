import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    Text,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useDeleteStoryMutation } from '../../api/story';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React, { useEffect } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const DeleteStory = () => {
    const [deleteStory] = useDeleteStoryMutation();
    const { handleClose, storyId, arrayId, removeIndex } = useModal();
    const { modals } = usePrismicData();
    const { t } = useTranslations();
    const {
        control,
        reset,
        formState: {}
    } = useForm();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });

    const onSubmit: SubmitHandler<any> = async () => {
        try {
            const deleteRequest: any = await deleteStory(storyId);

            removeIndex(arrayId);
            handleClose();

            if(deleteRequest?.error) {
                toast.error(<RichText content={modals.data.deleteStoryError}/>);
            } else {
                toast.success(<RichText content={modals.data.deleteStorySuccess}/>);
            }

        } catch (e) {
            toast.error(<RichText content={modals.data.deleteStoryError}/>);
            console.log(e);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    return (
        <ModalWrapper maxW={32} padding={1.5} w="100%">
            <Box>
                <CircledIcon icon="sad" large warning />
                <RichText
                    content={modals.data.deleteStoryTitle}
                    g900
                    large
                    medium
                    mt={1.25}
                />
                <RichText
                    content={modals.data.deleteStoryContent}
                    g500
                    mt={0.5}
                    small
                />
                <Row mt={1}>
                    <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                        <Button gray onClick={handleClose} w="100%">
                            <RichText
                                content={
                                    modals.data.deleteStoryCancelButtonLabel
                                }
                            />
                        </Button>
                    </Col>

                    <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                        <Button
                            error
                            isLoading={isSubmitting}
                            onClick={onSubmit}
                            w="100%"
                        >
                            <Text>{t('delete')}</Text>
                        </Button>
                    </Col>
                </Row>
            </Box>
        </ModalWrapper>
    );
};

export default DeleteStory;
