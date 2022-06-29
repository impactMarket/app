import React from 'react';

import {
    Box,
    Card,
    Grid,
    Tab,
    TabList,
    TabPanel,
    Tabs
} from '@impact-market/ui';

import ManagersTab from './ManagersTab'
import UserCard from './UserCard'
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const RolesTabs = ({ ambassador, community, managers, status, setRefreshingPage } : any) => {
    const { t } = useTranslations();

    return (
        !!Object.keys(community).length && (
            <Box mb={2} mt={3}>
                <Tabs>
                    <TabList>
                        {/* Todo: Add Merchands tabs*/}
                        <Tab
                            title={t('managers')}
                        />
                        {ambassador?.active &&
                            <Tab
                                title={t('ambassadors')}
                            />
                        }    
                    </TabList>
                
                    {/* Managers */}
                    <TabPanel>
                        <ManagersTab
                            ambassador={ambassador}
                            community={community}
                            managers={managers}
                            setRefreshingPage={setRefreshingPage}
                            status={status}
                        />  
                    </TabPanel>

                    {/* Ambassador */}
                    {ambassador?.active &&
                        <TabPanel>
                            <Grid cols={{ sm: 3, xs: 1 }}>
                                <Card>
                                    <UserCard
                                        community={community}
                                        data={ambassador}
                                    />
                                </Card>
                            </Grid> 
                        </TabPanel>
                    }
                </Tabs>
            </Box>
        )
)}

export default RolesTabs;
