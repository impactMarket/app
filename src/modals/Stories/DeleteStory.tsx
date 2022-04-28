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
import { useDeleteStoryMutation } from '../../api/story';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React, { useEffect } from 'react';
import RichText from '../../libs/Prismic/components/RichText';

const DeleteStory = () => {
    const [deleteStory] = useDeleteStoryMutation();
    const { handleClose, storyId, arrayId, removeIndex } = useModal();
    const { modals } = usePrismicData();
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
            await deleteStory(storyId);

            removeIndex(arrayId);
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
                    <Col colSize={{ sm: 6, xs: 12 }}>
                        <Button gray onClick={handleClose} w="100%">
                            <RichText
                                content={
                                    modals.data.deleteStoryCancelButtonLabel
                                }
                            />
                        </Button>
                    </Col>

                    <Col colSize={{ sm: 6, xs: 12 }}>
                        <Button
                            error
                            isLoading={isSubmitting}
                            onClick={onSubmit}
                            w="100%"
                        >
                            <RichText
                                content={
                                    modals.data.deleteStoryConfirmButtonLabel
                                }
                            />
                        </Button>
                    </Col>
                </Row>
            </Box>
        </ModalWrapper>
    );
};

export default DeleteStory;
