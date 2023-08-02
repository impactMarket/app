import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    Text,
    openModal,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useReportStoryMutation } from '../../api/story';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import processTransactionError from 'src/utils/processTransactionError';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

type Inputs = {
    reportAs: number;
};

const ReportStory = () => {
    const [showSuccess, setShowSuccess] = useState<number>(0);
    const [reportStory] = useReportStoryMutation();
    const { handleClose, storyId, removeIndexById, story, setStories } =
        useModal();
    const { modals } = usePrismicData();
    const { t } = useTranslations();
    const {
        control,
        reset,
        handleSubmit,
        formState: {}
    } = useForm<Inputs>();
    const { isSubmitting, isSubmitSuccessful } = useFormState({ control });
    const storyTypes = modals?.data?.reportStoryTypes;
    const reportOptions = Object.entries(storyTypes).map(
        ([key, value]: any) => ({ label: value.type, value: key })
    );
    const { getByKey } = useFilters();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const reportRequest: any = await reportStory({
                body: { typeId: data.reportAs },
                id: storyId
            });

            removeIndexById();

            setShowSuccess(1);

            if (reportRequest?.error) {
                toast.error(
                    <RichText content={modals.data.reportStoryError} />
                );
            } else {
                toast.success(
                    <RichText content={modals.data.reportStorySuccess} />
                );
            }
        } catch (error) {
            toast.error(<RichText content={modals.data.reportStoryError} />);
            processTransactionError(error, 'report_story');
            console.log(error);
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const handleCancel = () => {
        if (getByKey('id')) {
            openModal('openStory', { setStories, story, storyId: story.id });
        } else {
            handleClose();
        }
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
                            <Select
                                control={control}
                                isMultiple={false}
                                mt={1.25}
                                name="reportAs"
                                options={reportOptions}
                            />
                            <Row mt={1}>
                                <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                                    <Button
                                        gray
                                        onClick={handleCancel}
                                        type="button"
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

                                <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                                    <Button
                                        isLoading={isSubmitting}
                                        type="submit"
                                        w="100%"
                                    >
                                        <Text>{t('report')}</Text>
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
