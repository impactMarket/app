/* eslint-disable no-inline-comments */
import React, { useState } from 'react';

import {
    Avatar,
    Badge,
    Box,
    CircledIcon,
    DropdownMenu,
    Icon,
    Text,
    TextLink,
    toast
} from '@impact-market/ui';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../../utils/formatAddress';
import { getImage } from '../../../utils/images';
import { getUserName } from '../../../utils/users';
import { selectCurrentUser } from 'src/state/slices/auth';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Message from '../../../libs/Prismic/components/Message';
import Table from '../../../components/Table';
import config from '../../../../config';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const status = (status: any) => {
    const { t } = useTranslations();
    let badgeContent = null;
    let bgColor = '';

    switch (status) {
        case 1: // Pending
            badgeContent = (
                <>
                    <Icon icon={'clock'} g700 mr={0.2} />
                    <Text g700 extrasmall medium>
                        {t('pending')}
                    </Text>
                </>
            );
            bgColor = 'bgG50';
            break;
        case 3: // Requested Changes
            badgeContent = (
                <>
                    <Icon icon={'edit'} p700 mr={0.2} />
                    <Text g900 extrasmall medium>
                        {t('revise')}
                    </Text>
                </>
            );
            bgColor = 'bgP50';
            break;
        case 4: // Approved
            badgeContent = (
                <>
                    <Icon icon={'check'} s500 mr={0.2} />
                    <Text s700 extrasmall medium>
                        {t('approved')}
                    </Text>
                </>
            );
            bgColor = 'bgS50';
            break;
        case 5: // Rejected
            badgeContent = (
                <>
                    <Icon icon={'close'} e500 mr={0.2} />
                    <Text e700 extrasmall medium>
                        {t('rejected')}
                    </Text>
                </>
            );
            bgColor = 'bgE50';
            break;
        default:
            badgeContent = <></>;
            bgColor = 'bgN01';
    }

    return (
        <Box fLayout="center start" flex>
            <Badge {...{ [bgColor]: true }} style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {badgeContent}
                </Box>
            </Badge>
        </Box>
    );
};

const getColumns = (props: any) => {
    const { t } = useTranslations();
    const router = useRouter();

    const { borrower } = props;

    const { extractFromView } = usePrismicData();
    const {
        // addNote,
        // viewAllNotes,
        appliedOn,
        decisionOn,
        approveLoan,
        rejectLoan: rejectLoanText
    } = extractFromView('messages') as any;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    console.log('Borr: ', borrower);

    return [
        {
            minWidth: 12,
            render: () => (
                <Box fLayout="center start" flex>
                    {!!borrower?.avatarMediaPath ? (
                        <Avatar
                            extrasmall
                            url={getImage({
                                filePath: borrower?.avatarMediaPath,
                                fit: 'cover',
                                height: 32,
                                width: 32
                            })}
                        />
                    ) : (
                        <CircledIcon icon="user" small />
                    )}
                    <Box pl={0.75}>
                        {(!!borrower?.firstName || !!borrower?.lastName) && (
                            <Text g800 semibold small>
                                {getUserName(borrower)}
                            </Text>
                        )}
                        <Box>
                            <DropdownMenu
                                {...({} as any)}
                                icon="chevronDown"
                                items={[
                                    {
                                        icon: 'open',
                                        onClick: () => {
                                            window.open(
                                                config.explorerUrl?.replace(
                                                    '#USER#',
                                                    borrower?.address
                                                )
                                            );
                                        },
                                        title: t('openInExplorer')
                                    },
                                    {
                                        icon: 'copy',
                                        onClick: () =>
                                            copyToClipboard(borrower?.address),
                                        title: t('copyAddress')
                                    }
                                ]}
                                title={
                                    <Text p500 small>
                                        {formatAddress(
                                            borrower?.address,
                                            [6, 5]
                                        )}
                                    </Text>
                                }
                            />
                        </Box>
                    </Box>
                </Box>
            ),
            title: t('beneficiary'),
            value: 'name',
            width: '60%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.decisionOn ? (
                            <>
                                <Box
                                    flex
                                    fLayout="center start"
                                    fDirection={{ sm: 'column', xs: 'column' }}
                                >
                                    <Text medium g900 small>
                                        {`${
                                            dateHelpers.getDateAndTime(
                                                data?.decisionOn
                                            )[0]
                                        }`}
                                    </Text>
                                    <Text medium g400 extrasmall>
                                        {` ${
                                            dateHelpers.getDateAndTime(
                                                data?.decisionOn
                                            )[1]
                                        }`}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: 'Decision On',
            value: 'decisionOn',
            width: '10%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.createdAt ? (
                            <>
                                <Box
                                    flex
                                    fLayout="center start"
                                    fDirection={{ sm: 'column', xs: 'column' }}
                                >
                                    <Text medium g900 small>
                                        {`${
                                            dateHelpers.getDateAndTime(
                                                data?.createdAt
                                            )[0]
                                        }`}
                                    </Text>
                                    <Text medium g400 extrasmall>
                                        {` ${
                                            dateHelpers.getDateAndTime(
                                                data?.createdAt
                                            )[1]
                                        }`}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: t('accepted'),
            value: 'lastRepaymentDate',
            width: '10%'
        },
        {
            minWidth: 8,
            render: (data: any) => status(data?.status),
            title: t('status'),
            value: 'status',
            width: '10%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Link href={`/microcredit/form/${data?.id}`} passHref>
                        <TextLink medium p500 small>
                            Open Application
                        </TextLink>
                    </Link>
                );
            },
            width: '10%'
        }
    ];
};

const ApplicationHistory = (props: any) => {
    const {
        itemsPerPage,
        selected,
        setSelected,
        applications,
        count,
        loadingApplications,
        rejectLoan,
        mutate,
        borrower
    } = props;
    const auth = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({
                borrower
            })}
            itemsPerPage={itemsPerPage}
            isLoading={loadingApplications}
            mt={2}
            page={page}
            // count={count}
            pb={6}
            prefix={borrower?.forms}
            setItemOffset={setItemOffset}
        />
    );
};

export default ApplicationHistory;
