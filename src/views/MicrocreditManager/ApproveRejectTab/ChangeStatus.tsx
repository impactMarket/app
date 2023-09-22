import { Box, DropdownMenu, Icon, openModal, toast } from '@impact-market/ui';
import { FormStatus } from '../../../utils/formStatus';
import { getCookie } from 'cookies-next';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import Message from '../../../libs/Prismic/components/Message';
import React from 'react';
import config from '../../../../config';
import processTransactionError from 'src/utils/processTransactionError';
import styled from 'styled-components';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const EllipsisIcon = styled(Icon)`
    transform: rotate(90deg);
`;

export const changeStatus = (
    data: any,
    rejectLoan: any,
    limitReach: boolean,
    auth: any,
    mutate: any
) => {
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const {
        addNote,
        viewAllNotes,
        approveLoan,
        rejectLoan: rejectLoanText,
        loansRejectedSuccessfully
    } = extractFromView('messages') as any;
    const router = useRouter();

    const dropdownItems = [
        !limitReach &&
            data?.application?.status !== FormStatus.APPROVED && {
                icon: 'check',
                onClick: () =>
                    openModal('approveLoan', {
                        address: data?.address,
                        mutate
                    }),
                title: approveLoan
            },
        data?.application?.status !== FormStatus.APPROVED &&
            data?.application?.status !== FormStatus.REJECTED && {
                icon: 'close',
                onClick: () =>
                    rejectLoan(
                        auth,
                        data?.application?.id,
                        mutate,
                        loansRejectedSuccessfully
                    ),
                title: rejectLoanText
            },
        data?.application?.status !== FormStatus.INTERVIEW &&
            data?.application?.status !== FormStatus.APPROVED &&
            data?.application?.status !== FormStatus.REJECTED && {
                icon: 'userCheck',
                onClick: async () => {
                    try {
                        const result = await fetch(
                            `${config.baseApiUrl}/microcredit/applications`,
                            {
                                body: JSON.stringify([
                                    {
                                        applicationId: data?.application?.id,
                                        status: FormStatus.INTERVIEW
                                    }
                                ]),
                                headers: {
                                    Accept: 'application/json',
                                    Authorization: `Bearer ${auth.token}`,
                                    'Content-Type': 'application/json',
                                    message: getCookie('MESSAGE').toString(),
                                    signature: getCookie('SIGNATURE').toString()
                                },
                                method: 'PUT'
                            }
                        );

                        if (result.status === 201) {
                            mutate();
                            toast.success(t('setForInterviewSuccess'));
                        } else {
                            toast.error(<Message id="errorOccurred" />);
                        }
                    } catch (error) {
                        console.log(error);
                        toast.error(<Message id="errorOccurred" />);
                        processTransactionError(error, 'set_interview_state');
                    }
                },
                title: t('readyForInterview')
            },
        {
            icon: 'user',
            onClick: () => router.push(`/user/${data.address}`),
            title: t('openProfile')
        },
        {
            icon: 'bookOpen',
            onClick: () =>
                router.push(`/microcredit/form/${data?.application?.id}`),
            title: t('loanApplication')
        }
    ];

    const filteredItems = dropdownItems.filter((item) => !!item);

    return (
        <Box flex fLayout="center" style={{ gap: '1rem' }}>
            <DropdownMenu
                {...({} as any)}
                className="dropdown"
                icon="cardsStack"
                titleColor="g400"
                rtl={true}
                items={[
                    {
                        icon: 'upload',
                        onClick: () =>
                            openModal('addNote', {
                                borrowerId: data?.id
                            }),
                        title: addNote
                    },
                    {
                        icon: 'cardsStack',
                        onClick: () =>
                            router.push(
                                `/user/${data.address}?tab=communicationHistory`
                            ),
                        title: viewAllNotes
                    }
                ]}
            />
            <DropdownMenu
                {...({} as any)}
                className="dropdown"
                title={<EllipsisIcon icon="ellipsis" g400 />}
                titleColor="g400"
                rtl={true}
                items={filteredItems}
            />
        </Box>
    );
};
