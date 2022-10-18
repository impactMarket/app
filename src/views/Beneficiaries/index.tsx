/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, Display, Tab, TabList, TabPanel, Tabs, ViewContainer, openModal } from '@impact-market/ui';
import { getCommunityBeneficiaries } from '../../graph/user';
import { request } from 'graphql-request'
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userAmbassador, userManager } from '../../utils/users';
import BeneficiariesList from './BeneficiariesList';
import Filters from '../../components/Filters';
import NoBeneficiaries from './NoBeneficiaries';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import useFilters from '../../hooks/useFilters';
import useSWR from 'swr';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

import { useGetCommunityMutation } from '../../api/community';

const Beneficiaries: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const FakeTabPanel = TabPanel as any;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const { update, getByKey } = useFilters();


    const [getCommunity] = useGetCommunityMutation();
    const [community, setCommunity] = useState({}) as any;
    

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager) && !auth?.type?.includes(userAmbassador)) {
        router.push('/');

        return null;
    }

    const fetcher = (query: string) => request(config.graphUrl, query, variables);

    const variables = {address: ''};

    if (auth?.type?.includes(userAmbassador) && getByKey('community')) {
        variables.address = community.contractAddress !== undefined ? community.contractAddress.toLowerCase() : '';
    } else if (auth?.type?.includes(userManager)) {
        variables.address = auth?.user?.manager?.community;
    }

    const { data, error, mutate } = useSWR([
        getCommunityBeneficiaries,
        variables
    ], fetcher);

    const loadingCommunity = !data && !error;

    useEffect(() => {
        const init = async () => {
            try {
                const communityAddress = getByKey('community') || auth?.user?.manager?.community;
                const data = await getCommunity(communityAddress).unwrap();

                setCommunity(data);
            }
            catch (error) {
                console.log(error);
            }
        };

        if(!getByKey('state')) {
            router.push('/manager/beneficiaries?state=0&orderBy=since:desc', undefined, { shallow: true });
        }

        init();
    }, []);

    return (
        <ViewContainer isLoading={isLoading || loadingCommunity}>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex>
                <Box>
                    <Display g900  medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
                {
                    data?.beneficiaryEntities?.length > 0 &&
                    <Button icon="plus" mt={{ sm: 0, xs: 1 }} onClick={() => openModal('addBeneficiary', { mutate })}>
                        <String id="addBeneficiary" />
                    </Button>
                }
            </Box>
            {
                data?.beneficiaryEntities?.length > 0 && !loadingCommunity ?
                <Box mt={0.5}>
                    <Tabs defaultIndex={
                        // eslint-disable-next-line no-nested-ternary
                        getByKey('state') === '0' ? 0 : 
                        getByKey('state') === '1' ? 1 : 
                        getByKey('state') === '2' && 2
                    }>
                        <TabList>
                            { /* TODO: check if the "number" calculation is correct */ }
                            <Tab
                                number={data?.beneficiaryEntities?.filter((elem: any) => elem.state === 0)?.length}
                                onClick={() => update('state', 0)}
                                title={t('added')}
                            />
                            <Tab
                                number={data?.beneficiaryEntities?.filter((elem: any) => elem.state === 1)?.length}
                                onClick={() => update('state', 1)}
                                title={t('removed')}
                            />
                            <Tab
                                number={data?.beneficiaryEntities?.filter((elem: any) => elem.state === 2)?.length}
                                onClick={() => update('state', 2)}
                                title={t('blocked')}
                            />
                        </TabList>
                        <FakeTabPanel />
                        <FakeTabPanel />
                    </Tabs>
                    <Filters margin="1.5 0 0 0" maxW={20} property="search"/>
                    <BeneficiariesList community={community?.id} />
                </Box>
                :
                <NoBeneficiaries />
            }
        </ViewContainer>
    );
};

export default Beneficiaries;
