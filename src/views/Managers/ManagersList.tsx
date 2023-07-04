/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Text, TextLink } from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import String from '../../libs/Prismic/components/String';
import Table from '../../components/Table';
import useBeneficiaries from 'src/hooks/useBeneficiaries';
import useFilters from 'src/hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const getColumns = () => {
    const { t } = useTranslations();

    return [
        {
            minWidth: 14,
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
                        <Text p500 small>
                            {formatAddress(data.address, [6, 5])}
                        </Text>
                    </Box>
                </Box>
            ),
            title: t('manager'),
            value: 'name',
            width: '50%'
        },
        {
            minWidth: 4,
            render: (data: any) => (
                // TODO: check if date is correct and add correct locale
                <Text g500 small>
                    {data.since
                        ? new Date(data.since * 1000).toLocaleString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                          })
                        : ''}
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

const ManagersList: React.FC<{ community: string }> = (props) => {
    const { community } = props;
    const { getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);
    const router = useRouter();
    const {
        query: { search, state }
    } = router;

    const { data, loading } = useBeneficiaries(`${community}/managers`, {
        limit: itemsPerPage,
        offset: itemOffset,
        orderBy: getByKey('orderBy')
            ? getByKey('orderBy').toString()
            : 'since:desc',
        search: search ?? '',
        state: state ?? 0,
        ...{ community }
    });

    return (
        <Table
            actualPage={actualPage}
            columns={getColumns()}
            itemsPerPage={itemsPerPage}
            isLoading={loading}
            mt={1.25}
            page={page}
            count={data?.count}
            pb={6}
            prefix={data?.rows}
            setItemOffset={setItemOffset}
        />
    );
};

export default ManagersList;
