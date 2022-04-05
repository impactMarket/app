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
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useReportStoryMutation } from '../../api/story';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';

type Inputs = {
    reportAs: number;
};

const ReportStory = () => {
    const [showSuccess, setShowSuccess] = useState<number>(0);
    const [reportStory] = useReportStoryMutation();
    const { handleClose, storyId } = useModal();
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
    const StoryTypes = modals?.data?.reportStoryTypes;

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            await reportStory({
                body: {
                    typeId: data.reportAs
                },
                id: storyId
            });

            setShowSuccess(1);
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

    return (
        <>
            {showSuccess ? (
                <ModalWrapper maxW={25} padding={1.5} w="100%">
                    <Box center>
                        <CircledIcon icon="checkCircle" large success />
                        <RichText
                            content={modals.data.reportSuccessTitle}
                            g900
                            large
                            medium
                            mt={1.25}
                        />
                        <RichText
                            content={modals.data.reportSuccessContent}
                            g500
                            mt={0.5}
                            small
                        />
                        <Button fluid="xs" gray mt={2} onClick={handleClose}>
                            <RichText
                                content={
                                    modals.data.reportSuccessCloseButtonLabel
                                }
                            />
                        </Button>
                    </Box>
                </ModalWrapper>
            ) : (
                <ModalWrapper maxW={32} padding={1.5} w="100%">
                    <Box>
                        <CircledIcon icon="sad" large warning />
                        <RichText
                            content={modals.data.reportStoryTitle}
                            g900
                            large
                            medium
                            mt={1.25}
                        />
                        <RichText
                            content={modals.data.reportStoryContent}
                            g500
                            mt={0.5}
                            small
                        />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* // TODO add select component from UI */}
                            <select
                                {...register('reportAs', { required: true })}
                            >
                                {StoryTypes.map(
                                    (
                                        { type }: { type: string },
                                        index: number
                                    ) => (
                                        <option key={index} value={index}>
                                            {type}
                                        </option>
                                    )
                                )}
                            </select>

                            <Row mt={1}>
                                <Col colSize={{ sm: 6, xs: 12 }}>
                                    <Button
                                        gray
                                        onClick={handleCancel}
                                        w="100%"
                                    >
                                        <RichText
                                            content={
                                                modals.data
                                                    .reportStoryCancelButtonLabel
                                            }
                                        />
                                    </Button>
                                </Col>

                                <Col colSize={{ sm: 6, xs: 12 }}>
                                    <Button isLoading={isSubmitting} w="100%">
                                        <RichText
                                            content={
                                                modals.data
                                                    .reportStoryConfirmButtonLabel
                                            }
                                        />
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Box>
                </ModalWrapper>
            )}
        </>
    );
};

export default ReportStory;
