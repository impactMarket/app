import { useSelector } from 'react-redux';
import React from 'react';

import {
    Box,
    Button,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    openModal
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import CanBeRendered from '../../components/CanBeRendered';
import ManagersGrid from './ManagersGrid';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import useManagers from '../../hooks/useManagers';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Managers = ({
    ambassador,
    community,
    status,
    communityId,
    requestedCommunity
}: any) => {
    const { user } = useSelector(selectCurrentUser);
    const { t } = useTranslations();
    const fetcher = (url: string, headers: any | {}) =>
        fetch(config.baseApiUrl + url, headers).then((res) => res.json());
    const { managers, loadingManagers, mutate } = useManagers(
        communityId,
        ['limit=999', 'orderBy=state'],
        fetcher
    );

    const managersActive = managers?.rows?.filter(
        (manager: any) => manager.state === 0
    );
    const managersRemoved = managers?.rows?.filter(
        (manager: any) => manager.state === 1
    );

    return (
        <>
            {/* Add Manager  */}
            {status === 'valid' &&
                user?.address?.toLowerCase() ===
                    ambassador?.address?.toLowerCase() && (
                    <CanBeRendered types={['ambassador']}>
                        <Box mb={1} right>
                            <Button
                                icon="userPlus"
                                margin="0 0.5 0 0"
                                onClick={() =>
                                    openModal('addManager', {
                                        community,
                                        mutate: () =>
                                            mutate(
                                                `/communities/${communityId}/managers?limit=999&orderBy=state`
                                            )
                                    })
                                }
                            >
                                <String id="addNewManager" />
                            </Button>
                        </Box>
                    </CanBeRendered>
                )}

            <Tabs>
                <TabList>
                    <Tab title={'Active'} number={managersActive?.length} />

                    <Tab title={t('removed')} number={managersRemoved?.length} />
                </TabList>

                <TabPanel>
                    {!loadingManagers && !managers && (
                        <String id="noManagers" />
                    )}

                    <ManagersGrid
                        ambassador={ambassador}
                        community={community}
                        loadingManagers={loadingManagers}
                        managers={managersActive}
                        mutate={mutate}
                        communityId={communityId}
                        requestedCommunity={requestedCommunity}
                    />
                </TabPanel>

                <TabPanel>
                    {!loadingManagers && !managers && (
                        <String id="noManagers" />
                    )}

                    <ManagersGrid
                        ambassador={ambassador}
                        community={community}
                        loadingManagers={loadingManagers}
                        managers={managersRemoved}
                        mutate={mutate}
                        communityId={communityId}
                        requestedCommunity={requestedCommunity}
                    />
                </TabPanel>
            </Tabs>
        </>
    );
};

export default Managers;
