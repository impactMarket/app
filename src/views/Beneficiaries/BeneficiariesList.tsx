/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Text, TextLink } from '@impact-market/ui';
import { Community, useGetCommunityBeneficiariesMutation } from '../../api/community';
import { currencyFormat } from '../../utils/currencies';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import { useRouter } from 'next/router';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import Table from '../../components/Table';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const getColumns = (currency: any) => {
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
            render: (data: any) => (
                <Text g500 small>
                    {currencyFormat(data.claimed, currency)}
                </Text>
            ),
            sortable: true,
            title: t('claimed'),
            value: 'claimed',
            width: '20%'
        },
        {
            minWidth: 8,
            render: (data: any) => (
                <TextLink onClick={() => router.push(`/manager/beneficiaries/${data.address}`)} p500>
                    <String id="open" />
                </TextLink>
            ),
            width: '20%'
        }
    ];
};

const BeneficiariesList: React.FC<{ community: Community }> = props => {
    const { community } = props;

    const [getBeneficiaries] = useGetCommunityBeneficiariesMutation();

    // TODO: check if we should use the Currency and Language of the Community here
    const localeCurrency = new Intl.NumberFormat(community?.language || 'en-US', { 
        currency: community?.currency || 'USD', 
        style: 'currency' 
    });

    return (
        <Table
            callback={getBeneficiaries}
            columns={getColumns(localeCurrency)}    
            itemsPerPage={itemsPerPage}
            mt={1.25}
        />
    );
};

export default BeneficiariesList;
