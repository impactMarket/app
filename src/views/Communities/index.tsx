import { SWRConfig } from 'swr';
import { Tab, TabList, Tabs, ViewContainer } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import ClaimsMap from './ClaimsMap';
import CommunitiesList from './CommunitiesList';
import Filters from './Filters';
import Header from './Header';
import capitalize from 'lodash/capitalize';
import config from '../../../config';
import useCommunities from './communties';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const fetcher = (url: string) => fetch(config.baseApiUrl + url).then((res) => res.json());

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
    const [filters, setFilters] = useState({});
    const [activeTab, setActiveTab] = useState(
        getByKey('type') === 'myCommunities' ? 'myCommunities' : 'all'
    );
    const { communities, supportingCountries } = useCommunities(filters);

    if (
        !getByKey('type') ||
        (getByKey('type') === 'myCommunities' && !user?.roles.includes('ambassador'))
    ) {
        router.push('/communities?type=all', undefined, { shallow: true });
    } else if (
        getByKey('type') === 'myCommunities' &&
        user?.roles.includes('ambassador') &&
        !getByKey('ambassadorAddress')
    ) {
        update({ ambassadorAddress: user?.address });
    }

    useEffect(() => {
        setFilters(getAllQueryParams());
    }, [asPath]);

    const handleClickOnCommunityFilter = (communityFilter: any) => {
        if (communityFilter === 'myCommunities') {
            update({
                ambassadorAddress: user?.address,
                offset: 0,
                page: 0,
                state: 'valid',
                status: 'valid',
                type: 'myCommunities'
            });
            setActiveTab('myCommunities');
        } else {
            update({
                ambassadorAddress: null,
                offset: 0,
                page: 0,
                state: 'valid',
                status: 'valid',
                type: 'all'
            });
            setActiveTab('all');
        }
    };

    return (
        <ViewContainer>
            <SWRConfig value={{ fallback, fetcher }}>
                <Header
                    activeTab={activeTab}
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
                        {user?.roles.includes('ambassador') && (
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
                        activeTab={activeTab}
                        filterProperty="name"
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
