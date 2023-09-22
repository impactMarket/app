/* eslint-disable no-nested-ternary */
import {
    Avatar,
    Box,
    CircledIcon,
    DropdownMenu,
    Icon,
    ProgressBar,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { currencyFormat } from 'src/utils/currencies';
import { dateHelpers } from '../../../helpers/dateHelpers';
import { formatAddress } from '../../../utils/formatAddress';
import { getImage } from '../../../utils/images';
import { getUserName } from '../../../utils/users';
import { selectCurrentUser } from 'src/state/slices/auth';
import { selectRates } from 'src/state/slices/rates';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Message from '../../../libs/Prismic/components/Message';
import React from 'react';
import RichText from 'src/libs/Prismic/components/RichText';
import Table from '../../../components/Table';
import TooltipIcon from 'src/components/TooltipIcon';
import config from '../../../../config';
import styled from 'styled-components';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const PerformanceIcon = styled.div<{ performance: number }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) =>
        props.performance < 50
            ? '#FF4405'
            : props.performance < 100
            ? colors.w300
            : props.performance >= 100 && colors.s300};
`;

const EllipsisIcon = styled(Icon)`
    transform: rotate(90deg);
`;

const getColumns = () => {
    const { t } = useTranslations();
    const router = useRouter();

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
            minWidth: 15,
            render: (data: any) => (
                <Box fLayout="center start" flex>
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
                                {...({} as any)}
                                className="dropdown"
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
            title: t('borrower'),
            width: '35%'
        },
        {
            minWidth: 7,
            render: (data: any) => (
                <>
                    <Text g900 small center>
                        {currencyFormat(
                            data?.loan?.amount,
                            localeCurrency,
                            rates
                        )}
                    </Text>
                    <Text g500 small center>
                        {`${dateHelpers.secondsToMonth(data?.loan?.period)} ${t(
                            'months'
                        )}`}
                    </Text>
                </>
            ),
            sortable: true,
            title: t('loan'),
            value: 'amount',
            width: '10%'
        },
        {
            minWidth: 9,
            render: (data: any) => {
                return (
                    <Box flex>
                        <Text g900 small>
                            {data?.loan?.claimed
                                ? dateHelpers.ago(data?.loan?.claimed)
                                : '--'}
                        </Text>
                        {data?.loan?.claimed && (
                            <TooltipIcon black>
                                {dateHelpers.completeAmPm(data?.loan?.claimed)}
                            </TooltipIcon>
                        )}
                    </Box>
                );
            },
            title: t('claimed'),
            width: '15%'
        },
        {
            minWidth: 10,
            render: (data: any) => {
                return (
                    <>
                        <Text g900 small center>
                            {data?.loan?.lastRepaymentAmount
                                ? currencyFormat(
                                      data?.loan?.lastRepaymentAmount,
                                      localeCurrency,
                                      rates
                                  )
                                : t('none')}
                        </Text>
                        {data?.loan?.lastRepayment ? (
                            <Box flex>
                                <Text g500 small center>
                                    {dateHelpers.ago(data?.loan?.lastRepayment)}
                                </Text>
                                <TooltipIcon black>
                                    {dateHelpers.completeAmPm(
                                        data?.loan?.lastRepayment
                                    )}
                                </TooltipIcon>
                            </Box>
                        ) : (
                            ''
                        )}
                    </>
                );
            },
            sortable: true,
            title: t('lastRepayment'),
            value: 'lastRepayment',
            width: '13%'
        },
        {
            minWidth: 7,
            render: (data: any) => {
                const currentDebt = data?.loan?.amount - data?.loan?.repaid;
                const currentDebtRound = currentDebt < 0 ? 0 : currentDebt;
                const progress =
                    ((data?.loan?.amount - currentDebtRound) /
                        data?.loan?.amount) *
                    100;

                return (
                    <>
                        <Text g900 small center>
                            {currencyFormat(
                                currentDebtRound,
                                localeCurrency,
                                rates
                            )}
                        </Text>
                        <Box
                            flex
                            fLayout="center start"
                            style={{ gap: '0.2rem' }}
                        >
                            <ProgressBar progress={progress || 0} w="100%" />
                            <Text
                                g700
                                style={{
                                    fontSize: '0.75rem',
                                    lineHeight: 'inherit'
                                }}
                            >
                                {parseInt(progress.toString(), 10) || 0}%
                            </Text>
                        </Box>
                    </>
                );
            },
            sortable: true,
            title: t('currentDebt'),
            value: 'lastDebt',
            width: '13%'
        },
        {
            minWidth: 5,
            render: (data: any) => {
                return (
                    <Box flex fLayout="center" style={{ gap: '0.5rem' }}>
                        <PerformanceIcon performance={data?.performance} />
                        <Text g900 small center>
                            {data?.performance}%
                        </Text>
                    </Box>
                );
            },
            sortable: true,
            title: t('performance'),
            value: 'performance',
            width: '13%'
        },
        {
            minWidth: 2,
            render: (data: any) => (
                <DropdownMenu
                    {...({} as any)}
                    items={[
                        {
                            icon: 'user',
                            onClick: () =>
                                router.push(
                                    `/user/${data.address}?tab=repaymentHistory`
                                ),
                            title: t('openProfile')
                        }
                    ]}
                    title={<EllipsisIcon icon="ellipsis" g400 />}
                    className="dropdown"
                />
            ),
            width: '5%'
        }
    ];
};

const BorrowersList: React.FC<{
    actualPage: number;
    itemsPerPage: number;
    loadingBorrowers: boolean;
    page: number;
    count: number;
    borrowers: any;
    setItemOffset: any;
}> = (props) => {
    const {
        actualPage,
        itemsPerPage,
        loadingBorrowers,
        page,
        count,
        borrowers,
        setItemOffset
    } = props;

    const { extractFromView } = usePrismicData();
    const { performanceInfo } = extractFromView('messages') as any;

    return (
        <>
            <RichText
                content={performanceInfo}
                g500
                tAlign="right"
                // @ts-ignore
                style={{ fontSize: '0.75rem' }}
            />
            <Table
                actualPage={actualPage}
                columns={getColumns()}
                itemsPerPage={itemsPerPage}
                isLoading={loadingBorrowers}
                mt={1}
                page={page}
                count={count}
                pb={6}
                prefix={borrowers}
                setItemOffset={setItemOffset}
            />
        </>
    );
};

export default BorrowersList;
