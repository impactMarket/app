/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Text, TextLink } from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getInactiveBeneficiaries } from '../../graph/community';
import { getUserName } from '../../utils/users';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import Table from '../../components/Table';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const getColumns = () => {
    const { t } = useTranslations();
    const router = useRouter();

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
                        <Text p500 small>
                            {formatAddress(data.address, [6,5])}
                        </Text>
                    </Box>
                </Box>
            ),
            title: t('beneficiary'),
            value: 'name',
            width: '40%'
        },
        {
            minWidth: 4,
            render: (data: any) => (
                // TODO: check if date is correct and add correct locale
                <Text g500 small>
                    {data.since ? new Date(data.since * 1000).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </Text>
            ),
            sortable: true,
            title: t('addedOn'),
            value: 'since',
            width: '20%'
        },
        {
            minWidth: 8,
            render: (data: any) => {
                return (
                    <Text g500 small>
                        {data?.claimedFormatted}
                    </Text>
                )
            },
            sortable: true,
            title: t('claimed'),
            value: 'claimed',
            width: '20%'
        },
        {
            minWidth: 8,
            render: (data: any) => (
                <TextLink onClick={() => router.push(`/user/${data.address}`)} p500>
                    <String id="open" />
                </TextLink>
            ),
            width: '20%'
        }
    ];
};

const BeneficiariesList: React.FC<{ community: any, lastActivity: number }> = props => {
    const { community, lastActivity } = props;
    const { getByKey } = useFilters();

    const inactiveBeneficiaries = useQuery(getInactiveBeneficiaries, { variables: { 
        address: community?.contractAddress?.toLowerCase(), 
        lastActivity_lt: lastActivity
    }});

    const totalInactiveBeneficiaries = inactiveBeneficiaries?.data ? Object.keys(inactiveBeneficiaries?.data?.beneficiaryEntities).length : 0

    const thegraphData: any[] = []

    // Clone object to make it extensible
    if (!!inactiveBeneficiaries?.data) {
        inactiveBeneficiaries?.data?.beneficiaryEntities?.map((row: any) => {
            const rowClone = JSON.parse(JSON.stringify(row))
            
            thegraphData.push(rowClone)
        })    
    }

    return (
        <Table
            columns={getColumns()}
            count={getByKey('state') === "3" && totalInactiveBeneficiaries}
            itemsPerPage={itemsPerPage}
            mt={1.25}
            pb={6}
            prefix={`${community?.id}/beneficiaries`}
            thegraph={getByKey('state') === "3" && thegraphData}
        />
    );
};

export default BeneficiariesList;
