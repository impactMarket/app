import {
    Box,
    Button,
    CircledIcon,
    Col,
    DropdownMenu,
    ModalWrapper,
    Row,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useAnonymousReportMutation } from '../api/user';
import { useGetCommunityMutation } from '../api/community'
import String from '../libs/Prismic/components/String';

import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Input from '../components/Input';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const TEXT_LIMIT = 2000;

const ReportSuspiciousActivity = () => {
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);
    
    const { handleClose } = useModal();
    const [ success, setSuccess ] = useState(false)
    const { modals } = usePrismicData();
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const { isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });
 
    const [activityType, setActivityType] = useState("")
    const [dropdownTitle, setDropdownTitle] = useState(t('selectActivityType'))
    const [communityId, setCommunityId] = useState(0)

    const [anonymousReport] = useAnonymousReportMutation();
    const [getCommunity] = useGetCommunityMutation();

    useEffect(() => {
        const getCommunityFunc = async () => {
            try {

                const community: any = await getCommunity(user?.beneficiary?.community).unwrap()

                setCommunityId(community?.id)

            } catch (error) {
                console.log(error);
            }
        };

        getCommunityFunc();
    }, []);

    const dropdownItems = [
        {
            onClick: () => { setActivityType('general'); setDropdownTitle(t('general')) },
            title: t('general')
        },
        {
            onClick: () => { setActivityType('potential-fraud'); setDropdownTitle(t('potentialFraud')) },
            title: t('potentialFraud')
        }
    ];

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const content: any = {
                category: activityType,
                communityId,
                message: data.message.trim()
            };

            const postRequest: any = await anonymousReport(content);

            if(postRequest?.error) {
                toast.error(<RichText content="Error"/>);
            } else {
                setSuccess(true)
            }
        } catch (error) {
            toast.error(<RichText content="Error"/>);
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

    return (
        <>
            {!success ? 
                <ModalWrapper maxW={30.25} padding={1.5} w="100%">
                    <CircledIcon icon="sad" large warning />
                    <RichText
                        content={modals?.data?.reportSuspiciousActivityTitle}
                        large
                        mt={1.25}
                        semibold
                    />
                    <RichText
                        content={modals?.data?.reportSuspiciousActivitySomethingSuspicious[0]?.text}
                        g500
                        mt={0.5}
                        small
                    />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box mt={0.5}>
                            <DropdownMenu
                                asButton
                                headerProps={{
                                    fLayout: "center between"
                                }}
                                icon="chevronDown"
                                items={dropdownItems}
                                title={dropdownTitle}
                                wrapperProps={{
                                    mt:1,
                                    w:"100%"
                                }}
                            />
                        </Box>
                        <Box mt={1.25}>
                            <Input
                                control={control}
                                hint={errors?.message ? t('requiredField') : ''}
                                limit={TEXT_LIMIT}
                                name="message"
                                placeholder={modals?.data?.reportSuspiciousActivityPotentialIlegalActivity[0]?.text}
                                rows={6}
                                rules={{ required: true }}
                                withError={errors?.message}
                            />
                        </Box>

                        <Row mt={1}>
                            <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                                <Button gray onClick={handleCancel} w="100%">
                                    <RichText
                                        content={
                                            modals?.data?.createStoryCancelButtonLabel
                                        }
                                    />
                                </Button>
                            </Col>

                            <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                                <Button isLoading={isSubmitting} type="submit" w="100%">
                                    <RichText
                                        content={
                                            modals?.data?.createStoryConfirmButtonLabel
                                        }
                                    />
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </ModalWrapper>
            :
                <ModalWrapper center maxW={25.25} padding={1.5} w="100%">
                    <CircledIcon icon="checkCircle" large success />
                    <RichText
                        center
                        content={modals?.data?.reportSupiciousActivitySubmitted}
                        large
                        mt={1.25}
                        semibold
                    />
                    <RichText
                        center
                        content={modals?.data?.reportSuspiciousActivityThanks[0].text}
                        g500
                        mt={0.5}
                        small
                    />
                    <Button gray mt={1.5} onClick={handleClose} type="button" w="100%">
                        <String id="close" />
                    </Button>
                </ModalWrapper>
            }
        </>
    );
};

export default ReportSuspiciousActivity;
