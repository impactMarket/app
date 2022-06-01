import React from 'react';

import {
    DropdownMenu,
    Grid,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from '@impact-market/ui';

import Community from './Community'
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const TabsComponent = ({setStatusFilter, setActiveTab, activeTab, statusFilter, communities, communitiesTabs, loading}: any) => {
    const { t } = useTranslations();
    
    //  Make status CamelCase
    const firstLetter = statusFilter?.charAt(0).toUpperCase()
    const restOfText = statusFilter?.slice(1)
    const status = `${firstLetter}${restOfText}`
    
    //  Todo: Add texts on Prismic
    const dropdownItems = [
        {
            icon: 'check',
            onClick: () => setStatusFilter('valid'),
            title: 'Valid'
        },
        {
            icon: 'loader',
            onClick: () => setStatusFilter('pending'),
            title: 'Pending'
        },
        {
            icon: 'trash',
            onClick: () => setStatusFilter('removed'),
            title: 'Removed'
        }
    ];

    return (
        <>
        <Tabs>
                <TabList>
                    <Tab
                        onClick={() => setActiveTab('all')}
                        title={t('all')}
                    />
                    <Tab
                        onClick={() => setActiveTab('myCommunities')}
                        title={t('myCommunities')}
                    />
                </TabList>

                {activeTab === 'myCommunities' &&
                    <DropdownMenu
                        asButton
                        icon="chevronDown"
                        items={dropdownItems}
                        title={status}
                        wrapperProps={{
                            mt:1
                        }}
                    />
                }

                {!!Object.keys(communities).length &&
                    communitiesTabs.map((key: number) => (
                        <TabPanel key={key}>
                            {loading ? (
                                <Spinner isActive />
                            ) : ( 
                                <Grid colSpan={1.5} cols={{ sm: 4, xs: 1 }}>
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
                            )}
                        </TabPanel>
                    ))}
                </Tabs>
        </>
    );
};

export default TabsComponent;
