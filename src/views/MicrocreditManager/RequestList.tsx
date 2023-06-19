/* eslint-disable react-hooks/rules-of-hooks */
import {
    Avatar,
    Box,
    CircledIcon,
    DropdownMenu,
    ProgressBar,
    Text,
    openModal,
    toast,
    colors,
    Icon,
    Badge
} from '@impact-market/ui';
import { dateHelpers } from '../../helpers/dateHelpers';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import { selectCurrentUser } from 'src/state/slices/auth';
import { selectRates } from 'src/state/slices/rates';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import Table from './Table';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const loanStatus = (status: any) => {
    let badgeContent = null;

    if (false) {
        badgeContent = (
            <Badge bgS50 style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon icon="check" s500 mr={0.2} />
                    <Text s700 extrasmall medium>
                        Approved
                    </Text>
                </Box>
            </Badge>
        );
    } else if (false) {
        badgeContent = (
            <Badge bgE50 style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon icon="close" e500 mr={0.2} />
                    <Text e700 extrasmall medium>
                        Rejected
                    </Text>
                </Box>
            </Badge>
        );
    } else {
        badgeContent = (
            <Badge bgP50 style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                >
                    <Icon icon="clock" p500 mr={0.2} />
                    <Text p700 extrasmall medium>
                        Pending
                    </Text>
                </Box>
            </Badge>
        );
    }

    return (
        <Box fLayout="center start" flex>
            {badgeContent}
        </Box>
    );
};

const getColumns = (props: any) => {
    const { t } = useTranslations();
    const router = useRouter();
    const { setSelected, selected } = props;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    const auth = useSelector(selectCurrentUser);
    const rates = useSelector(selectRates);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        maximumFractionDigits: 3,
        style: 'currency'
    });

    return [
        {
            minWidth: 17,
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    {!selected.some(
                        (item: any) => item.address === data.address
                    ) ? (
                        <Box
                            style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                borderRadius: '6px',
                                borderColor: colors.g300,
                                borderWidth: '1px',
                                borderStyle: 'solid'
                            }}
                            mr={0.75}
                            onClick={() => {
                                console.log('data', data);
                                setSelected((selected: any) => [
                                    ...selected,
                                    data
                                ]);
                            }}
                        ></Box>
                    ) : (
                        <Box
                            flex
                            style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                borderRadius: '6px',
                                borderColor: colors.p600,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.p50
                            }}
                            mr={0.75}
                            onClick={() => {
                                console.log('data', data);
                                setSelected((selected: any) =>
                                    selected.filter(
                                        (item: any) =>
                                            item.address !== data.address
                                    )
                                );
                            }}
                        >
                            <Icon icon="check" p600 />
                        </Box>
                    )}
                    {!!data.avatarMediaPath ? (
                        <Avatar
                            extrasmall
                            url={getImage({
                                filePath: data.avatarMediaPath,
                                fit: 'cover',
                                height: 32,
                                width: 32
                            })}
                        />
                    ) : (
                        <CircledIcon icon="user" small />
                    )}
                    <Box pl={0.75}>
                        {(!!data.firstName || !!data.lastName) && (
                            <Text g800 semibold small>
                                {getUserName(data)}
                            </Text>
                        )}
                        <Box>
                            <DropdownMenu
                                icon="chevronDown"
                                items={[
                                    {
                                        icon: 'open',
                                        onClick: () =>
                                            window.open(
                                                config.explorerUrl?.replace(
                                                    '#USER#',
                                                    data.address
                                                )
                                            ),
                                        title: t('openInExplorer')
                                    },
                                    {
                                        icon: 'copy',
                                        onClick: () =>
                                            copyToClipboard(data.address),
                                        title: t('copyAddress')
                                    }
                                ]}
                                title={
                                    <Text p500 small>
                                        {formatAddress(data.address, [6, 5])}
                                    </Text>
                                }
                            />
                        </Box>
                    </Box>
                </Box>
            ),
            title: t('beneficiary'),
            value: 'name',
            width: '35%'
        },
        {
            minWidth: 12,
            render: (data: any) => {
                const score = 734;
                const progress = (score / 850) * 100;

                return (
                    <>
                        <Box
                            flex
                            fLayout="center start"
                            style={{ gap: '0.8rem' }}
                        >
                            <ProgressBar
                                progress={progress}
                                success={progress > 83}
                                warning={progress > 74 && progress <= 83}
                                error={progress > 0 && progress <= 74}
                                w="100%"
                            />
                            <Text
                                g700
                                style={{
                                    fontSize: '0.75rem',
                                    lineHeight: 'inherit'
                                }}
                            >
                                {score}
                            </Text>
                        </Box>
                    </>
                );
            },
            sortable: true,
            title: 'Credit Score',
            value: 'creditScore',
            width: '20%'
        },
        {
            minWidth: 10,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {true ? (
                            <>
                                <Text medium g900 small>
                                    {'Jan 21, 2022'}
                                </Text>
                                <Text g500 small>
                                    {'22:34am'}
                                </Text>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            sortable: true,
            title: 'Applied on',
            value: 'maturity',
            width: '10%'
        },
        {
            minWidth: 10,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {false ? (
                            <>
                                <Text medium g900 small>
                                    {'Jan 21, 2022'}
                                </Text>
                                <Text g500 small>
                                    {'22:34am'}
                                </Text>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            sortable: true,
            title: 'Decision on',
            value: 'lastRepayment',
            width: '15%'
        },
        {
            minWidth: 10,
            render: (data: any) => {
                console.log(data);
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {false ? (
                            <>
                                <Text medium g900 small>
                                    {'Jan 21, 2022'}
                                </Text>
                                <Text g500 small>
                                    {'22:34am'}
                                </Text>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            sortable: true,
            title: t('accepted'),
            value: 'lastRepaymentDate',
            width: '15%'
        },
        {
            minWidth: 10,
            render: (data: any) => loanStatus(data.status),
            sortable: true,
            title: 'Approved',
            value: 'currentDebt',
            width: '15%'
        },
        {
            minWidth: 4,
            render: (data: any) => (
                <Box flex fLayout="center start" style={{  gap: '1rem' }}>
                    <DropdownMenu
                                icon="cardsStack"
                                titleColor='g400'
                                rtl={true}
                                items={[
                                    {
                                        icon: 'upload',
                                        onClick: () =>
                                        openModal('addNote'),
                                        title: "Add Note"
                                    },
                                    {
                                        icon: 'cardsStack',
                                        onClick: () =>
                                            console.log('View All Notes'),
                                        title: "View All Notes"
                                    }
                                ]}
                            />
                    
                        <DropdownMenu
                                icon="ellipsis"
                                titleColor='g400'
                                rtl={true}
                                items={[
                                    {
                                        icon: 'check',
                                        onClick: () =>
                                            openModal('approveLoan'),
                                        title: "Approve Loan"
                                    },
                                    {
                                        icon: 'close',
                                        onClick: () =>
                                            console.log('Reject'),
                                        title: "Reject Loan"
                                    }
                                ]}
                            />
                </Box>
            ),
            width: '10%'
        }
    ];
};

const RequestList = (props: any) => {
    const {
        borrowers,
        count,
        loadingBorrowers,
        itemsPerPage,
        setItemOffset,
        page,
        actualPage,
        setSelected,
        selected
    } = props;

    console.log('Borrowers', borrowers);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({ setSelected, selected })}
            itemsPerPage={itemsPerPage}
            loadingBorrowers={loadingBorrowers}
            page={page}
            count={count}
            pb={6}
            prefix={borrowers}
            setItemOffset={setItemOffset}
        />
    );
};

export default RequestList;
