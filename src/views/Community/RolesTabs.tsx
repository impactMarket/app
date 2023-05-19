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

import RolesGrid from './RolesGrid';
import UserCard from '../../components/UserCard';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const RolesTabs = ({
    ambassador,
    community,
    merchants,
    status,
    communityId,
    requestedCommunity
}: any) => {
    const { t } = useTranslations();

    return (
        community &&
        !!Object.keys(community).length && (
            <Box mb={2} mt={3}>
                <Tabs>
                    <TabList>
                        <Tab title={t('managers')} />
                        {ambassador?.active && <Tab title={t('ambassadors')} />}
                        {!!merchants?.length && <Tab title={t('merchants')} />}
                    </TabList>

                    {/* Managers */}
                    <TabPanel>
                        <RolesGrid
                            ambassador={ambassador}
                            community={community}
                            communityId={communityId}
                            requestedCommunity={requestedCommunity}
                            status={status}
                        />
                    </TabPanel>

                    {/* Ambassador */}
                    {ambassador?.active && (
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
                    )}

                    {/* Merchants */}
                    {!!merchants?.length && (
                        <TabPanel>
                            <RolesGrid
                                community={community}
                                requestedCommunity={requestedCommunity}
                                role={{ merchants }}
                            />
                        </TabPanel>
                    )}
                </Tabs>
            </Box>
        )
    );
};

export default RolesTabs;
