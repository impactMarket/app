/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Display, Tab, TabList, TabPanel, Tabs, ViewContainer } from '@impact-market/ui';
import { getCommunityManagers } from '../../graph/user';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunityMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../../utils/users';
import Filters from './Filters';
import ManagersList from './ManagersList';
import NoManagers from './NoManagers';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Beneficiaries: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);
    const [community, setCommunity] = useState({}) as any;
    const FakeTabPanel = TabPanel as any;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const { update, getByKey } = useFilters();
    const [getCommunity] = useGetCommunityMutation();

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    const communityManagers = useQuery(getCommunityManagers, { variables: { address: auth?.user?.manager?.community } });

    useEffect(() => {
        if(!getByKey('state')) {
            router.push('/manager/managers?state=active', undefined, { shallow: true });
        }

        const init = async () => {
            try {
                const data = await getCommunity(auth?.user?.manager?.community).unwrap();

                setCommunity(data);

                toggleLoadingCommunity(false);
            }
            catch (error) {
                console.log(error);

                toggleLoadingCommunity(false);
            }
        };

        init();
    }, []);

    return (
        <ViewContainer isLoading={isLoading || loadingCommunity || communityManagers?.loading}>
            <Box>
                <Display g900  medium>
                    {title}
                </Display>
                <RichText content={content} g500 mt={0.25} />
            </Box>
            {
                communityManagers?.data?.managerEntities?.length > 0 ?
                <Box mt={0.5}>
                    <Tabs defaultIndex={getByKey('state') === 'removed' ? 1 : 0}>
                        <TabList>
                            { /* TODO: check if the "number" calculation is correct */ }
                            <Tab
                                number={communityManagers?.data?.managerEntities?.filter((elem: any) => elem.state === 0)?.length}
                                onClick={() => update('state', 'active')}
                                title={t('added')}
                            />
                            <Tab
                                number={communityManagers?.data?.managerEntities?.filter((elem: any) => elem.state === 1)?.length}
                                onClick={() => update('state', 'removed')}
                                title={t('removed')}
                            />
                        </TabList>
                        <FakeTabPanel />
                        <FakeTabPanel />
                    </Tabs>
                    <Filters />
                    <ManagersList community={community?.id} />
                </Box>
                :
                <NoManagers />
            }
        </ViewContainer>
    );
};

export default Beneficiaries;
