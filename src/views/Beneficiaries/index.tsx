/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Display, Tab, TabList, TabPanel, Tabs, ViewContainer, openModal } from '@impact-market/ui';
import { getCommunityBeneficiaries } from '../../graph/user';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunityMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../../utils/users';
import BeneficiariesList from './BeneficiariesList';
import Filters from '../../components/Filters';
import NoBeneficiaries from './NoBeneficiaries';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Beneficiaries: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);
    const [community, setCommunity] = useState({}) as any;
    const [refresh, setRefresh] = useState<Date>(new Date());
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

    const communityBeneficiaries = useQuery(getCommunityBeneficiaries, { variables: { address: auth?.user?.manager?.community } });

    useEffect(() => {
        if(!getByKey('state')) {
            router.push('/manager/beneficiaries?state=active', undefined, { shallow: true });
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

    const onAddBeneficiary = () => {
        setRefresh(new Date());
        communityBeneficiaries.refetch();
    }

    return (
        <ViewContainer isLoading={isLoading || loadingCommunity || communityBeneficiaries?.loading}>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex>
                <Box>
                    <Display g900  medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
                {
                    communityBeneficiaries?.data?.beneficiaryEntities?.length > 0 &&
                    <Button icon="plus" mt={{ sm: 0, xs: 1 }} onClick={() => openModal('addBeneficiary', { onAddBeneficiary })}>
                        <String id="addBeneficiary" />
                    </Button>
                }
            </Box>
            {
                communityBeneficiaries?.data?.beneficiaryEntities?.length > 0 ?
                <Box mt={0.5}>
                    <Tabs defaultIndex={getByKey('state') === 'removed' ? 1 : 0}>
                        <TabList>
                            { /* TODO: check if the "number" calculation is correct */ }
                            <Tab
                                number={communityBeneficiaries?.data?.beneficiaryEntities?.filter((elem: any) => elem.state === 0)?.length}
                                onClick={() => update('state', 'active')}
                                title={t('added')}
                            />
                            <Tab
                                number={communityBeneficiaries?.data?.beneficiaryEntities?.filter((elem: any) => elem.state === 1)?.length}
                                onClick={() => update('state', 'removed')}
                                title={t('removed')}
                            />
                            <Tab
                                number={communityBeneficiaries?.data?.beneficiaryEntities?.filter((elem: any) => elem.state === 2)?.length}
                                onClick={() => update('state', 'blocked')}
                                title={t('blocked')}
                            />
                        </TabList>
                        <FakeTabPanel />
                        <FakeTabPanel />
                    </Tabs>
                    <Filters margin="1.5 0 0 0" maxW={20} property="search"/>
                    <BeneficiariesList community={community} refresh={refresh} />
                </Box>
                :
                <NoBeneficiaries />
            }
        </ViewContainer>
    );
};

export default Beneficiaries;
