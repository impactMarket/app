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
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useReportStoryMutation } from '../../api/story';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import Select from '../../components/Select';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

type Inputs = {
    reportAs: number;
};

const ReportStory = () => {
    const [showSuccess, setShowSuccess] = useState<number>(0);
    const [reportStory] = useReportStoryMutation();
    const { handleClose, storyId, arrayId, removeIndex } = useModal();
    const { modals } = usePrismicData();
    const { t } = useTranslations();
    const {
        control,
        reset,
        handleSubmit,
        formState: {}
    } = useForm<Inputs>();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });
    const storyTypes = modals?.data?.reportStoryTypes;
    const reportOptions = Object.entries(
        storyTypes
    ).map(([key, value]: any) => ({ label: value.type, value: key }));

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const reportRequest: any = await reportStory({
                body: {
                    typeId: data.reportAs
                },
                id: storyId
            });

            removeIndex(arrayId);
            setShowSuccess(1);

            if(reportRequest?.error) {
                toast.error(<RichText content={modals.data.reportStoryError}/>);
            } else {
                toast.success(<RichText content={modals.data.reportStorySuccess}/>);
            }

        } catch (e) {
            toast.error(<RichText content={modals.data.reportStoryError}/>);
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
                                    <Button isLoading={isSubmitting} w="100%">
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
