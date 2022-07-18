import React from 'react';

import {
    Box,
    Grid,
    Pagination,
    Row,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@impact-market/ui';

import Community from './Community'
import Filters from './Filters'
import Map from '../../components/Map';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const Content = ({setStatusFilter, setActiveTab, activeTab, statusFilter, communities, communitiesTabs, loading, currentPage, handlePageClick, pageCount, user, setItemOffset, filtersCommunityCountries, claimsLocations}: any) => {
    const { t } = useTranslations();
    const { update, getByKey } = useFilters();
    
    //  Make status CamelCase
    const firstLetter = statusFilter?.charAt(0).toUpperCase()
    const restOfText = statusFilter?.slice(1)
    const status = `${firstLetter}${restOfText}`
    
    const dropdownItems = [
        {
            icon: 'check',
            onClick: () => {setStatusFilter('valid'); update('state', 'valid')},
            title: t('valid')
        },
        {
            icon: 'loader',
            onClick: () => {setStatusFilter('pending'); update('state', 'pending')},
            title: t('pending')
        },
        {
            icon: 'trash',
            onClick: () => {setStatusFilter('removed'); update('state', 'removed')},
            title: t('removed')
        }
    ];

    const handleClickOnCommunityFilter = (communityFilter: any) => {
        setActiveTab(communityFilter); 
        update('type', communityFilter);
        setItemOffset(0)
    }

    return (
        <Tabs defaultIndex={
            // eslint-disable-next-line no-nested-ternary
            getByKey('type') === 'all' ? 0 :
            getByKey('type') === 'myCommunities' ? 1 : 0
        }>
            <TabList>
                <Tab
                    onClick={() => {handleClickOnCommunityFilter('all')}}
                    title={t('all')}
                />
                {user?.roles.includes('ambassador') &&
                    <Tab
                        onClick={() => handleClickOnCommunityFilter('myCommunities')}
                        title={t('myCommunities')}
                    />
                }
            </TabList>

            <Filters
                activeTab={activeTab}
                communitiesCountries={filtersCommunityCountries}
                filterProperty="name"
                initialValue={getByKey('country')}
                myCommunityItems={dropdownItems}
                myCommunityTitle={status}
            />

            {!!claimsLocations.length &&
                <Box
                    borderRadius={{ sm: '16px 0 0 16px', xs: '0' }}
                    h={{ sm: 22, xs: 11 }}
                    mt={1}
                    overflow="hidden"
                >
                    <Map claims={claimsLocations} />
                </Box>
            }

            {!!Object.keys(communities).length &&
                communitiesTabs.map((key: number) => (
                    <TabPanel key={key}>
                        {loading ? (
                            <Row fLayout="center" h="50vh" mt={2}>
                                <Spinner isActive />
                            </Row>
                        ) : ( 
                            <>
                                <Grid colSpan={1.5} cols={{ lg: 4, sm: 2, xs: 1 }}>
                                    {communities?.data?.count === 0 ?
                                        <String id="noCommunities" />
                                    :
                                        communities?.data?.rows.map(
                                            (community: any, key: number) => (
                                                <Community 
                                                    community={community}
                                                    key={key}
                                                />
                                            )
                                        )
                                    }
                                </Grid>
                                <Pagination
                                    currentPage={currentPage}
                                    handlePageClick={handlePageClick}
                                    mt={2}
                                    nextIcon="arrowRight"
                                    nextLabel="Next"
                                    pageCount={pageCount}
                                    pb={2}
                                    previousIcon="arrowLeft"
                                    previousLabel="Previous"
                                />
                            </>
                        )}
                    </TabPanel>
                ))}
            </Tabs>
    );
};

export default Content;
