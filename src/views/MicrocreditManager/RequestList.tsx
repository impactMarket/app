/* eslint-disable react-hooks/rules-of-hooks */
import {
    Avatar,
    Badge,
    Box,
    CircledIcon,
    colors,
    DropdownMenu,
    Icon,
    openModal,
    ProgressBar,
    Text,
    toast,
} from '@impact-market/ui';

import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import Table from './Table';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useMicrocreditApplications from 'src/hooks/useMicrocreditApplications';
import useFilters from 'src/hooks/useFilters';
import {useState} from 'react';
import { dateHelpers } from 'src/helpers/dateHelpers';


const loanStatus = (status: any) => {
    let badgeContent = null;
    const { t } = useTranslations();
   

    if (status == 1) {
        badgeContent = (
            <Badge bgS50 style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Icon icon="check" s500 mr={0.2} />
                    <Text s700 extrasmall medium>
                        {t('approved')}
                    </Text>
                </Box>
            </Badge>
        );
    } else if (status == 0) {
        badgeContent = (
            <Badge bgE50 style={{ width: 'fit-content' }}>
                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Icon icon="close" e500 mr={0.2} />
                    <Text e700 extrasmall medium>
                       {t('rejected')}
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
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Icon icon="clock" p500 mr={0.2} />
                    <Text p700 extrasmall medium>
                        {t('pending')}
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

    const { setSelected, selected } = props;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };


    return [
        {
            minWidth: 17,
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    {!selected.some(
                        (item: any) => item.address === data.address
                    ) ? (
                        <Box
                            borderRadius="0.5rem"
                            w="1.5rem"
                            h="1.5rem"
                            borderColor={colors.g300}
                            mr={0.75}
                            style={{
                                borderColor: colors.g300,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                cursor: 'pointer'
                            }}

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
                            w="1.5rem"
                            h="1.5rem"
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '0.5rem',
                                borderColor: colors.p600,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                backgroundColor: colors.p50,
                                cursor: 'pointer'
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
        //                         {score}
        //                     </Text>
        //                 </Box>
        //             </>
        //         );
        //     },
        //     sortable: true,
        //     title: 'Credit Score',
        //     value: 'creditScore',
        //     width: '20%'
        // },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.appliedOn ? (
                            <>
                                <Text medium g900 small>
                                    {dateHelpers.compact(data?.application?.appliedOn)}
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
            title: t('appliedOn'),
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
                                <Text medium g900 small>
                                    {dateHelpers.compact(data?.application?.decisionOn)}
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
            title: t('decisionOn'),
            value: 'decisionOn',
            width: '15%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                
                return (
                    <Box flex fDirection={{ sm: 'column', xs: 'column' }}>
                        {data?.application?.createdAt? (
                            <>
                                <Text medium g900 small>
                                    {dateHelpers.compact(data?.application?.createdAt)}
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
            render: (data: any) => loanStatus(data?.application?.status),
            sortable: true,
            title: t('approved'),
            value: 'currentDebt',
            width: '15%'
        },
        {
            minWidth: 4,
            render: (data: any) => (
                <Box flex fLayout="center start" style={{ gap: '1rem' }}>
                    <DropdownMenu
                        icon="cardsStack"
                        titleColor="g400"
                        rtl={true}
                        items={[
                            {
                                icon: 'upload',
                                onClick: () => openModal('addNote'),
                                title: 'Add Note'
                            },
                            {
                                icon: 'cardsStack',
                                onClick: () => console.log('View All Notes'),
                                title: 'View All Notes'
                            }
                        ]}
                    />

                    <DropdownMenu
                        icon="ellipsis"
                        titleColor="g400"
                        rtl={true}
                        items={[
                            {
                                icon: 'check',
                                onClick: () => openModal('approveLoan'),
                                title: 'Approve Loan'
                            },
                            {
                                icon: 'close',
                                onClick: () => console.log('Reject'),
                                title: 'Reject Loan'
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
        itemsPerPage,
        selected,
        setSelected,
        filter,
    } = props;

    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;

    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);
    

    const { applications, count, loadingApplications } = useMicrocreditApplications([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        filter ? `filter=${filter}` : ''
    ]);
    

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({ setSelected, selected })}
            itemsPerPage={itemsPerPage}
            loadingBorrowers={loadingApplications}
            page={page}
            count={count}
            pb={6}
            prefix={applications}
            setItemOffset={setItemOffset}
        />
    );
};

export default RequestList;