/* eslint-disable no-inline-comments */
import React, { useState } from 'react';

import {
    Avatar,
    Box,
    CircledIcon,
    DropdownMenu,
    Text,
    TextLink,
    toast
} from '@impact-market/ui';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../../../utils/formatAddress';
import { getImage } from '../../../../utils/images';
import { getUserName } from '../../../../utils/users';
import { loanStatus } from 'src/views/MicrocreditManager/ApproveRejectTab/StatusBadge';
import { useMicrocreditBorrower } from 'src/hooks/useMicrocredit';
import { usePrismicData } from '../../../../libs/Prismic/components/PrismicDataProvider';
import Link from 'next/link';
import Message from '../../../../libs/Prismic/components/Message';
import Table from '../../../../components/Table';
import config from '../../../../../config';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../../../libs/Prismic/hooks/useTranslations';

const getColumns = (props: any) => {
    const { t } = useTranslations();
    const { borrower } = props;
    const { extractFromView } = usePrismicData();
    const { decisionOn, openApplication } = extractFromView(
        'microcredit'
    ) as any;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

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
            title: t('borrower'),
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
            title: decisionOn,
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
            render: (data: any) => loanStatus(data?.status),
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
                            {openApplication}
                        </TextLink>
                    </Link>
                );
            },
            width: '10%'
        }
    ];
};

const ApplicationHistory = (props: any) => {
    const { itemsPerPage, user } = props;
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrower, loadingBorrower } = useMicrocreditBorrower([
        `address=${user?.address}`,
        `include=forms`
    ]);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({
                borrower
            })}
            itemsPerPage={itemsPerPage}
            isLoading={loadingBorrower}
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
