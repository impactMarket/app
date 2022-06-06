/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Text, TextLink } from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import { useGetCommunityManagersMutation } from '../../api/community';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import Table from '../../components/Table';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const getColumns = () => {
    const { t } = useTranslations();

    // TODO: add texts to Prismic

    return [
        {
            minWidth: 14,
            render: (data: any) => (
                <Box fLayout="center start" flex>
                    { /* TODO: add "small" size to CircledIcon: 32 x 32 px */ }
                    {!!data.avatarMediaPath ? 
                        <Avatar extrasmall url={getImage({ filePath: data.avatarMediaPath, fit: 'cover', height: 32, width: 32 })} />  
                        : 
                        <CircledIcon icon="user" />
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
            title: 'Manager',
            value: 'name', 
            width: '50%'
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
            width: '25%'
        },
        {
            minWidth: 8,
            render: () => (
                // TODO: removed "disabled" and add destination URL for Manager detail page
                <TextLink disabled p500>
                    <String id="open" />
                </TextLink>
            ),
            width: '25%'
        }
    ];
};

const ManagersList: React.FC<{ community: string }> = props => {
    const { community } = props;
    const [getManagers] = useGetCommunityManagersMutation();

    return (
        <Table
            callback={getManagers}
            callbackProps={{ community }}
            columns={getColumns()}    
            itemsPerPage={itemsPerPage}
            mt={1.25}
        />
    );
};

export default ManagersList;
