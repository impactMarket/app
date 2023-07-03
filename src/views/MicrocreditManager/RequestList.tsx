/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
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
    toast, 
} from '@impact-market/ui';

import { dateHelpers } from 'src/helpers/dateHelpers';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditApplications from 'src/hooks/useMicrocreditApplications';

import config from '../../../config';

import Message from '../../libs/Prismic/components/Message';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';

import Table from './Table';



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
    } else if (status == 2) {
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

    const { selected, setSelected } = props;

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };


    return [
        {
            minWidth: 17,
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    {
                        !selected.some((item: any) => item.address === data.address) ? (
                            <CheckBox
                                onClick={() => {
                                    setSelected((selected: any) => [...selected, data]);
                                }}
                            ></CheckBox>
                        ) : (
                            <CheckBox
                                flex
                                color
                                onClick={() => {
                                    setSelected((selected: any) =>
                                        selected.filter((item: any) => item.address !== data.address)
                                    );
                                }}
                            >
                                <Icon icon="check" p600 />
                            </CheckBox>
                        )
                    }
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
            value: 'status',
            width: '15%'
        },
        {
            minWidth: 4,
            render: () => (
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
                                onClick: () => {},
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
                                onClick: () => {},
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
    

    const { applications, count, loadingApplications} = useMicrocreditApplications([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        filter ? `filter=${filter}` : ''
    ]);

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns({ selected, setSelected })}
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
