import {
    Box,
    Card,
    DropdownMenu,
    Table,
    Text,
    colors,
    toast
} from '@impact-market/ui';
import { dateHelpers } from 'src/helpers/dateHelpers';
import { formatAddress } from '../../utils/formatAddress';
import Link from 'next/link';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import styled from 'styled-components';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const TableWrapper = styled(Box)`
    > div > div {
        overflow-x: unset;
    }
`;

const getColumns = (myCommunities: any, activitySort: boolean) => {
    const { t } = useTranslations();

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    return [
        {
            render: (data: any) => {
                const communityData = myCommunities?.filter(
                    (community: { value: string }) =>
                        community.value.toLowerCase() === data.id
                );

                console.log(communityData);

                return (
                    <Box>
                        <Link
                            href={`/communities/${communityData[0]?.id}`}
                            passHref
                        >
                            <Text g800 semibold small as="a">
                                {communityData[0]?.label}
                            </Text>
                        </Link>
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
                                                    data.id
                                                )
                                            ),
                                        title: t('openInExplorer')
                                    },
                                    {
                                        icon: 'copy',
                                        onClick: () => copyToClipboard(data.id),
                                        title: t('copyAddress')
                                    }
                                ]}
                                title={formatAddress(data.id, [6, 5])}
                            />
                        </Box>
                    </Box>
                );
            },
            title: t('communityName'),
            width: '80%'
        },
        {
            render: (data: any) => (
                <Text g500 small>
                    {dateHelpers.complete(data?.lastActivity) ||
                        t('noActivity')}
                </Text>
            ),
            sortable: true,
            title: t('lastActiveOn'),
            value: activitySort ? 'active' : undefined,
            width: '20%'
        }
    ];
};

const Activity: React.FC<{
    activitySort: boolean;
    data: any;
    loading: boolean;
    myCommunities: any;
    setActivitySort: any;
}> = (props) => {
<<<<<<< HEAD
    const { activitySort, data, loading, myCommunities, setActivitySort } =
        props;
=======
    const {
        activitySort,
        data,
        loading,
        myCommunities,
        setActivitySort
    } = props;
>>>>>>> 18835b4 (Final touches rejected view)
    const { t } = useTranslations();

    const handleSort = () => {
        setActivitySort(!activitySort);
    };

    return (
        <Card>
            <Box pb={1.5} pt={0.5}>
                <Text sColor={colors.g900} semibold large>
                    <String id="activity" />
                </Text>
            </Box>
            <TableWrapper>
                <Table
                    columns={getColumns(myCommunities, activitySort)}
                    isLoading={loading || !data}
                    noResults={t('noResults')}
                    rows={data}
                    handleSort={handleSort}
                />
            </TableWrapper>
        </Card>
    );
};

export default Activity;
