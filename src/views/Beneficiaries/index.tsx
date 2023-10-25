/* eslint-disable no-nested-ternary */
import {
    Box,
    Button,
    Display,
    Tab,
    TabList,
    Tabs,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import { getCommunityBeneficiaries } from '../../graph/user';
import { getInactiveBeneficiaries } from '../../graph/community';
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
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

import { useGetCommunityMutation } from '../../api/community';
import { useManager } from '@impact-market/utils/useManager';
import { useQuery } from '@apollo/client';

const lastActivity = Math.floor(new Date().getTime() / 1000 - 1036800);

const Beneficiaries: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const { update, getByKey } = useFilters();

    const [getCommunity] = useGetCommunityMutation();
    const [community, setCommunity] = useState({}) as any;

    const { community: communityDataFromHook } = useManager(
        getByKey('community') || auth?.user?.manager?.community
    );

    // Check if current User has access to this page
    if (
        !auth?.type?.includes(userManager) &&
        !auth?.type?.includes(userAmbassador)
    ) {
        router.push('/');

        return null;
    }

    const { data: beneficiariesCount, loading } = useQuery(
        getCommunityBeneficiaries,
        {
            variables: {
                address:
                    auth?.type?.includes(userAmbassador) &&
                    getByKey('community')
                        ? community.contractAddress !== undefined
                            ? community.contractAddress.toLowerCase()
                            : ''
                        : auth?.type?.includes(userManager) &&
                          auth?.user?.manager?.community
            }
        }
    );

    useEffect(() => {
        const init = async () => {
            try {
                const communityAddress =
                    getByKey('community') || auth?.user?.manager?.community;
                const data = await getCommunity(communityAddress).unwrap();

                setCommunity(data);
            } catch (error) {
                console.log(error);
            }
        };

        init();
    }, []);

    const inactiveBeneficiaries = useQuery(getInactiveBeneficiaries, {
        variables: {
            address: community?.contractAddress?.toLowerCase(),
            lastActivity_lt: lastActivity
        }
    });

    // States -> 0: Added, 1: Removed, 2: Blocked
    const beneficiariesStateLength = (state: number) => {
        return beneficiariesCount?.beneficiaryEntities?.filter(
            (elem: any) => elem.state === state
        )?.length;
    };

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={isLoading || loading || inactiveBeneficiaries?.loading}
        >
            <Box
                fDirection={{ sm: 'row', xs: 'column' }}
                fLayout="start between"
                flex
            >
                <Box>
                    <Display g900 medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
                {beneficiariesCount?.beneficiaryEntities?.length > 0 && (
                    <Button
                        icon="plus"
                        mt={{ sm: 0, xs: 1 }}
                        onClick={() =>
                            openModal('addBeneficiary', {
                                activeBeneficiariesLength:
                                    beneficiariesStateLength(0),
                                maxBeneficiaries:
                                    communityDataFromHook?.maxBeneficiaries
                            })
                        }
                    >
                        <String id="addBeneficiary" />
                    </Button>
                )}
            </Box>
            {beneficiariesCount?.beneficiaryEntities?.length > 0 && !loading ? (
                <Box mt={0.5}>
                    <Tabs defaultIndex={+getByKey('state')}>
                        <TabList>
                            <Tab
                                number={beneficiariesStateLength(0)}
                                onClick={() => update({ page: 0, state: 0 })}
                                title={t('added')}
                            />
                            <Tab
                                number={beneficiariesStateLength(1)}
                                onClick={() => update({ page: 0, state: 1 })}
                                title={t('removed')}
                            />
                            <Tab
                                number={beneficiariesStateLength(2)}
                                onClick={() => update({ page: 0, state: 2 })}
                                title={t('blocked')}
                            />
                        </TabList>
                    </Tabs>
                    <Filters margin="1.5 0 0 0" maxW={20} property="search" />
                    <BeneficiariesList
                        community={community}
                        lastActivity={lastActivity}
                    />
                </Box>
            ) : (
                <NoBeneficiaries />
            )}
        </ViewContainer>
    );
};

export default Beneficiaries;
