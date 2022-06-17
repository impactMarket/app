import React from 'react';

import {
    DropdownMenu,
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
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const TabsComponent = ({setStatusFilter, setActiveTab, activeTab, statusFilter, communities, communitiesTabs, loading, currentPage, handlePageClick, pageCount, user, setItemOffset}: any) => {
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

            {activeTab === 'myCommunities' &&
                    <DropdownMenu
                        asButton
                        headerProps={{
                            fLayout: "center between"
                        }}
                        icon="chevronDown"
                        items={dropdownItems}
                        title={status}
                        wrapperProps={{
                            mt:1,
                            w:15
                        }}
                    />
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

export default TabsComponent;
