import { SWRConfig } from 'swr';
import { Tab, TabList, Tabs, ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import ClaimsMap from './ClaimsMap';
import CommunitiesList from './CommunitiesList';
import Filters from './Filters';
import Header from './Header';
import capitalize from 'lodash/capitalize';
import config from '../../../config';
import useCommunities from '../../hooks/useCommunities';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

const Communities = (props: any) => {
    const { fallback } = props;
    const { user } = useSelector(selectCurrentUser);
    const { update, getByKey, getAllQueryParams } = useFilters();
    const statusFilter = getByKey('state') || 'valid';
    const [communitiesTabs] = useState(['all', 'myCommunities']);
    const { t } = useTranslations();
    const router = useRouter();
    const { asPath } = router;
    const status = capitalize(statusFilter.toString());
    const [filters, setFilters] = useState({} as any);
    const { communities, supportingCountries } = useCommunities(filters);

    if (
        getByKey('type') === 'myCommunities' &&
        user?.roles?.includes('ambassador') &&
        !getByKey('ambassadorAddress')
    ) {
        update({ ambassadorAddress: user?.address });
    }

    useEffect(() => {
        setFilters(getAllQueryParams());
    }, [asPath]);

    useEffect(() => {
        !!getByKey('search')
            ? setFilters({ ...getAllQueryParams(), page: 0 })
            : setFilters({
                  ...getAllQueryParams(),
                  page: +getByKey('page') ?? 0
              });
        update('page', 0);
    }, [getByKey('search')]);

    const handleClickOnCommunityFilter = (communityFilter: any) => {
        const resetFilters = {
            country: '',
            page: 0,
            state: 'valid'
        };

        if (communityFilter === 'myCommunities') {
            update({
                ambassadorAddress: user?.address,
                ...resetFilters,
                type: 'myCommunities'
            });
        } else {
            update({
                ambassadorAddress: null,
                ...resetFilters,
                type: 'all'
            });
        }
    };

    return (
        <ViewContainer {...({} as any)}>
            <SWRConfig value={{ fallback, fetcher }}>
                <Header
                    activeTab={filters.type}
                    supportingCommunities={communities?.data?.count?.toString()}
                    supportingCountries={supportingCountries}
                    user={user}
                />
                <Tabs
                    defaultIndex={getByKey('type') === 'myCommunities' ? 1 : 0}
                >
                    <TabList>
                        <Tab
                            onClick={() => {
                                handleClickOnCommunityFilter('all');
                            }}
                            title={t('all')}
                        />
                        {user?.roles?.includes('ambassador') && (
                            <Tab
                                onClick={() =>
                                    handleClickOnCommunityFilter(
                                        'myCommunities'
                                    )
                                }
                                title={t('myCommunities')}
                            />
                        )}
                    </TabList>

                    <Filters
                        filterProperty="search"
                        filters={filters}
                        myCommunityTitle={status}
                    />

                    <ClaimsMap />

                    <CommunitiesList
                        communitiesTabs={communitiesTabs}
                        filters={filters}
                    />
                </Tabs>
            </SWRConfig>
        </ViewContainer>
    );
};

export default Communities;
