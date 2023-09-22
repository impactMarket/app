import {
    Avatar,
    Box,
    CircledIcon,
    DropdownMenu,
    Icon,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { changeStatus } from './ChangeStatus';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../../utils/formatAddress';
import { getImage } from '../../../utils/images';
import { getUserName } from '../../../utils/users';
import { loanStatus } from './StatusBadge';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useLoanManager } from '@impact-market/utils';
import { useSelector } from 'react-redux';
import Message from '../../../libs/Prismic/components/Message';
import React from 'react';
import Table from '../../../components/Table';
import config from '../../../../config';
import styled from 'styled-components';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const CheckBox = styled(Box)`
    border-radius: 0.5rem;
    border-width: 1px;
    border-style: solid;
    cursor: pointer;
    height: 1.5rem;
    margin-right: 0.75rem;
    width: 1.5rem;
    flex-direction: ${(props) => (props.flex ? 'row' : 'none')};
    align-items: ${(props) => (props.flex ? 'center' : 'none')};
    justify-content: ${(props) => (props.flex ? 'center' : 'none')};
    background-color: ${(props) => (props.color ? colors.p50 : 'none')};
    border-color: ${(props) => (props.color ? colors.p600 : colors.g300)};
`;

const getColumns = (props: any) => {
    const { t } = useTranslations();

    const { auth, selected, setSelected, rejectLoan, limitReach, mutate } =
        props;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    return [
        {
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    {!selected.some(
                        (item: any) => item.address === data.address
                    ) ? (
                        <CheckBox
                            onClick={() => {
                                setSelected((selected: any) => [
                                    ...selected,
                                    data
                                ]);
                            }}
                        ></CheckBox>
                    ) : (
                        <CheckBox
                            flex
                            color
                            onClick={() => {
                                setSelected((selected: any) =>
                                    selected.filter(
                                        (item: any) =>
                                            item.address !== data.address
                                    )
                                );
                            }}
                        >
                            <Icon icon="check" p600 />
                        </CheckBox>
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
                                {...({} as any)}
                                className="dropdown"
                                icon="chevronDown"
                                items={[
                                    {
                                        icon: 'open',
                                        onClick: () => {
                                            window.open(
                                                config.explorerUrl?.replace(
                                                    '#USER#',
                                                    data.address
                                                )
                                            );
                                        },
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
            value: 'name'
        },
        // {
        //     render: (data: any) => {
        //         const score = 734;
        //         const progress = (score / 850) * 100;

        //         return (
        //             <>
        //                 <Box
        //                     flex
        //                     fLayout="center start"
        //                     style={{ gap: '0.8rem' }}
        //                 >
        //                     <ProgressBar
        //                         progress={progress}
        //                         success={progress > 83}
        //                         warning={progress > 74 && progress <= 83}
        //                         error={progress > 0 && progress <= 74}
        //                         w="100%"
        //                     />
        //                     <Text
        //                         g700
        //                         style={{
        //                             fontSize: '0.75rem',
        //                             lineHeight: 'inherit'
        //                         }}
        //                     >
        //                         {t('score')}
        //                     </Text>
        //                 </Box>
        //             </>
        //         );
        //     },
        //     sortable: true,
        //     title: 't(creditScore)',
        //     value: 'creditScore',
        // },
        {
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.appliedOn ? (
                            <>
                                <Box
                                    flex
                                    fDirection={{ sm: 'column', xs: 'column' }}
                                >
                                    <Text medium g900 small>
                                        {`${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.appliedOn
                                            )[0]
                                        }`}
                                    </Text>
                                    <Text medium g400 extrasmall>
                                        {` ${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.appliedOn
                                            )[1]
                                        }`}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'---'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: t('applied'),
            value: 'appliedOn'
        },
        {
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.decisionOn ? (
                            <>
                                <Box
                                    flex
                                    fDirection={{ sm: 'column', xs: 'column' }}
                                >
                                    <Text medium g900 small>
                                        {`${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.decisionOn
                                            )[0]
                                        }`}
                                    </Text>
                                    <Text medium g400 extrasmall>
                                        {` ${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.decisionOn
                                            )[1]
                                        }`}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'---'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: t('decision'),
            value: 'decisionOn'
        },
        {
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.createdAt ? (
                            <>
                                <Box
                                    flex
                                    fDirection={{ sm: 'column', xs: 'column' }}
                                >
                                    <Text medium g900 small>
                                        {`${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.createdAt
                                            )[0]
                                        }`}
                                    </Text>
                                    <Text medium g400 extrasmall>
                                        {` ${
                                            dateHelpers.getDateAndTime(
                                                data?.application?.createdAt
                                            )[1]
                                        }`}
                                    </Text>
                                </Box>
                            </>
                        ) : (
                            <Text medium g400 small>
                                {'---'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: t('claimed'),
            value: 'lastRepaymentDate'
        },
        {
            render: (data: any) => loanStatus(data?.application?.status),
            title: t('status'),
            value: 'status'
        },
        {
            render: (data: any) =>
                changeStatus(data, rejectLoan, limitReach, auth, mutate)
        }
    ];
};

const BorrowersList = (props: any) => {
    const {
        itemsPerPage,
        selected,
        setSelected,
        applications,
        actualPage,
        count,
        loadingApplications,
        setItemOffset,
        page,
        rejectLoan,
        mutate
    } = props;
    const auth = useSelector(selectCurrentUser);

    const { managerDetails } = useLoanManager();

    const limitReach =
        managerDetails?.currentLentAmount >=
        managerDetails?.currentLentAmountLimit;

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({
                auth,
                limitReach,
                mutate,
                rejectLoan,
                selected,
                setSelected
            })}
            itemsPerPage={itemsPerPage}
            isLoading={loadingApplications}
            mt={2}
            page={page}
            count={count}
            pb={6}
            prefix={applications}
            setItemOffset={setItemOffset}
        />
    );
};

export default BorrowersList;
