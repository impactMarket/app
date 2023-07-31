/* eslint-disable no-inline-comments */
import React from 'react';
import styled from 'styled-components';

import {
    Avatar,
    Badge,
    Box,
    CircledIcon,
    DropdownMenu,
    Icon,
    Text,
    colors,
    openModal,
    toast
} from '@impact-market/ui';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../../utils/formatAddress';
import { getImage } from '../../../utils/images';
import { getUserName } from '../../../utils/users';
import { selectCurrentUser } from 'src/state/slices/auth';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Message from '../../../libs/Prismic/components/Message';
import Table from '../../../components/Table';
import config from '../../../../config';
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

const loanStatus = (status: any) => {
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
                    <Icon icon={'menu'} p700 mr={0.2} />
                    <Text g900 extrasmall medium>
                        In Revision
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

    const { auth, selected, setSelected, rejectLoan, limitReach, mutate } =
        props;

    const { extractFromView } = usePrismicData();
    const {
        addNote,
        viewAllNotes,
        appliedOn,
        decisionOn,
        approveLoan,
        rejectLoan: rejectLoanText
    } = extractFromView('messages') as any;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    return [
        {
            minWidth: 14,
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
                                console.log(data);
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
            title: t('beneficiary'),
            value: 'name',
            width: '35%'
        },
        // {
        //     minWidth: 12,
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
        //     width: '20%'
        // },
        {
            minWidth: 9,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.appliedOn ? (
                            <>
                                <Box
                                    flex
                                    fLayout="center start"
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
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: appliedOn,
            value: 'appliedOn',
            width: '10%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.decisionOn ? (
                            <>
                                <Box
                                    flex
                                    fLayout="center start"
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
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: decisionOn,
            value: 'decisionOn',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.createdAt ? (
                            <>
                                <Box
                                    flex
                                    fLayout="center start"
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
                                {'- - -'}
                            </Text>
                        )}
                    </Box>
                );
            },
            title: t('accepted'),
            value: 'lastRepaymentDate',
            width: '15%'
        },
        {
            minWidth: 10,
            render: (data: any) => loanStatus(data?.application?.status),
            title: 'Status',
            value: 'status',
            width: '15%'
        },
        {
            minWidth: 4,
            render: (data: any) => {
                const dropdownItems = [
                    !limitReach &&
                        data?.application?.status !== 4 && {
                            icon: 'check',
                            onClick: () =>
                                openModal('approveLoan', {
                                    address: data?.address,
                                    mutate
                                }),
                            title: approveLoan
                        },
                    data?.application?.status !== 5 && {
                        icon: 'close',
                        onClick: () =>
                            rejectLoan(auth, data?.application?.id, mutate),
                        title: rejectLoanText
                    },
                    {
                        icon: 'user',
                        onClick: () => router.push(`/user/${data.address}`),
                        title: t('openProfile')
                    }
                ];

                const filteredItems = dropdownItems.filter((item) => !!item);

                return (
                    <Box flex fLayout="center start" style={{ gap: '1rem' }}>
                        <DropdownMenu
                        {...({} as any)}
                        icon="cardsStack"
                        titleColor="g400"
                        rtl={true}
                        items={[
                            {
                                icon: 'upload',
                                onClick: () => openModal('addNote',
                                {
                                    applicationId: data?.application?.id
                                }
                                ),
                                title: addNote
                            },
                            {
                                icon: 'cardsStack',
                                onClick: () => {},
                                title: viewAllNotes
                            }
                        ]}
                    /> 
                        <DropdownMenu
                            {...({} as any)}
                            className="dropdown"
                            icon="ellipsis"
                            titleColor="g400"
                            rtl={true}
                            items={filteredItems}
                        />
                    </Box>
                );
            },
            width: '10%'
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
