/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, DropdownMenu, ProgressBar, Text, TextLink, toast } from '@impact-market/ui';
import { dateHelpers } from '../../helpers/dateHelpers'
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import { useRouter } from 'next/router';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import Table from './Table';
import config from '../../../config';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const getColumns = () => {
    const { t } = useTranslations();
    const router = useRouter();

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    }

    return [
        {
            minWidth: 14,
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    {!!data.avatarMediaPath ? 
                        <Avatar extrasmall url={getImage({ filePath: data.avatarMediaPath, fit: 'cover', height: 32, width: 32 })} />  
                        : 
                        <CircledIcon icon="user" small />
                    }
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
                                        onClick: () => window.open(config.explorerUrl?.replace('#USER#', data.address)),
                                        title: t('openInExplorer')
                                    },
                                    {
                                        icon: 'copy',
                                        onClick: () => copyToClipboard(data.address),
                                        title: t('copyAddress')
                                    }
                                ]}
                                title={<Text p500 small>{formatAddress(data.address, [6,5])}</Text>}
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
            minWidth: 8,
            render: (data: any) => (
                <Text g900 small>
                    {data?.loans?.amount} cUSD
                </Text>
            ),
            sortable: true,
            title: t('loan'),
            value: 'loan',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Text g900 small>
                        {`${dateHelpers.secondsToMonth(data?.loans?.period)} ${t('months')}`}
                    </Text>
                )
            },
            sortable: true,
            title: t('maturity'),
            value: 'maturity',
            width: '10%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Text g900 small>
                        {data?.loans?.lastRepaymentAmount ?
                            `${data?.loans?.lastRepaymentAmount?.slice(0, 5) } cUSD`
                        :
                            t('none')
                        }
                    </Text>
                )
            },
            sortable: true,
            title: t('lastRepayment'),
            value: 'lastRepayment',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Text g900 small>
                        {data?.loans?.lastRepayment ? 
                            dateHelpers.ago(data?.loans?.lastRepayment)
                        :
                            '--'
                        }
                    </Text>
                )
            },
            sortable: true,
            title: t('lastRepaymentDate'),
            value: 'lastRepaymentDate',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                const currentDebt = (data?.loans?.amount - data?.loans?.repayed)
                const currentDebtRound = currentDebt < 0 ? 0 : currentDebt;
                const progress = (data?.loans?.amount - currentDebtRound) / data?.loans?.amount * 100;

                return (
                    <>
                        <Text g900 small center>{currentDebtRound} cUSD</Text>
                        <Box flex fLayout="center start" style={{ gap: "0.2rem" }}>
                            <ProgressBar 
                                progress={progress}
                                success={progress > 66}
                                warning={progress > 33 && progress <= 66}
                                error={progress > 0 && progress <= 33}
                                w="100%"
                            />
                            <Text g700 style={{ fontSize: "0.75rem", lineHeight: "inherit" }}>{parseInt(progress.toString(), 10)}%</Text>
                        </Box>            
                    </>
                    
                )
            },
            sortable: true,
            title: t('currentDebt'),
            value: 'currentDebt',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => (
                <TextLink onClick={() => router.push(`/user/${data.address}`)} p500>
                    <Text small>{t('openProfile')}</Text>
                </TextLink>
            ),
            width: '10%'
        }
    ];
};

const BorrowersList: React.FC<{}> = () => {
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(
        page * itemsPerPage || 0
    );
    
    const { borrowers, loadingBorrowers, pageCount } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
    ], itemsPerPage);

    return (
        <Table
            columns={getColumns()}
            mt={1.25}
            pb={6}
            page={page}
            actualPage={actualPage}
            setItemOffset={setItemOffset}
            pageCount={pageCount}
            prefix={borrowers}
            loadingBorrowers={loadingBorrowers}
        />
    );
};

export default BorrowersList;
