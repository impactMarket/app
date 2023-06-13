/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Display, ViewContainer } from '@impact-market/ui';
import {
    getCommunityEntity,
    getInactiveBeneficiaries
} from '../../graph/community';
import { selectCurrentUser } from '../../state/slices/auth';
import {
    useGetCommunityAmbassadorMutation,
    useGetCommunityMutation
} from '../../api/community';
import { useManager } from '@impact-market/utils';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../../utils/users';
import Alerts from './Alerts';
import Cards from './Cards';
import ProgressBar from './ProgressBar';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Manager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const [community, setCommunity] = useState({}) as any;
    const [communityAmbassador, setCommunityAmbassador] = useState({}) as any;
    const [primaryCards, setPrimaryCards] = useState([]) as any;
    const [secondaryCards, setSecondaryCards] = useState([]) as any;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    const { activeBeneficiariesTooltip, inactiveBeneficiariesTooltip } =
        extractFromView('cards') as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityAmbassador] = useGetCommunityAmbassadorMutation();

    const language = auth?.user?.language || 'en-US';

    // Check if current User has access to this page
    if (!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    const {
        canRequestFunds,
        community: { hasFunds },
        fundsRemainingDays,
        isReady,
        requestFunds
    } = useManager(auth?.user?.manager?.community);

    // TODO: on error should we show any warning?
    const communityEntity = useQuery(getCommunityEntity, {
        variables: { address: auth?.user?.manager?.community }
    });

    const inactiveBeneficiaries = useQuery(getInactiveBeneficiaries, {
        variables: {
            address: community?.contractAddress?.toLowerCase(),
            lastActivity_lt: Math.floor(new Date().getTime() / 1000 - 1036800)
        }
    });

    // Check if there's a Community with the address associated with the User. If not, return to Homepage
    useEffect(() => {
        const init = async () => {
            try {
                const communityData = await getCommunity(
                    auth?.user?.manager?.community
                ).unwrap();
                const communityAmbassador = await getCommunityAmbassador(
                    communityData?.id
                ).unwrap();

                setCommunity(communityData);
                setCommunityAmbassador(communityAmbassador);

                toggleLoadingCommunity(false);
            } catch (error) {
                console.log(error);

                router.push('/');

                return false;
            }
        };

        init();
    }, []);

    const totalInactiveBeneficiaries = inactiveBeneficiaries?.data
        ? Object.keys(inactiveBeneficiaries?.data?.beneficiaryEntities).length
        : 0;
    const totalActiveBeneficiaries = inactiveBeneficiaries?.data
        ? communityEntity?.data?.communityEntity?.beneficiaries -
          totalInactiveBeneficiaries
        : 0;

    useEffect(() => {
        setPrimaryCards([
            {
                number:
                    communityEntity?.data?.communityEntity?.beneficiaries || 0,
                title: t('totalBeneficiaries'),
                url: '/manager/beneficiaries'
            },
            {
                number: communityEntity?.data?.communityEntity?.managers || 0,
                title: t('totalManagers'),
                url: '/manager/managers'
            }
        ]);

        setSecondaryCards([
            // {
            //     number: 0,
            //     title: t('suspiciousActivity'),
            //     url: '/manager/beneficiaries'
            // },
            // {
            //     number: 0,
            //     title: t('blocked'),
            //     url: '/manager/beneficiaries'
            // },
            {
                number: totalActiveBeneficiaries || 0,
                title: t('activeBeneficiaries'),
                tooltip: true,
                tooltipContent: activeBeneficiariesTooltip,
                tooltipVariables: {
                    days: '12'
                },
                url: '/manager/beneficiaries'
            },
            {
                number: totalInactiveBeneficiaries || 0,
                title: t('inactiveBeneficiaries'),
                tooltip: true,
                tooltipContent: inactiveBeneficiariesTooltip,
                tooltipVariables: {
                    days: '12'
                },
                url: '/manager/beneficiaries?state=3&orderBy=since:desc'
            }
        ]);
    }, [communityEntity?.data, inactiveBeneficiaries?.data]);

    return (
        <ViewContainer
            isLoading={
                !isReady ||
                isLoading ||
                loadingCommunity ||
                communityEntity?.loading ||
                inactiveBeneficiaries?.loading
            }
        >
            <Box pl={0.75} pr={0.75}>
                <Alerts
                    canRequestFunds={canRequestFunds}
                    fundsRemainingDays={fundsRemainingDays}
                    hasFunds={hasFunds}
                    requestFunds={requestFunds}
                />
                <Display g900 medium>
                    {title}
                </Display>
                <RichText
                    content={content}
                    g500
                    mt={0.25}
                    variables={{ community: community?.name }}
                />
            </Box>
            <Box column fLayout="start" flex>
                <Cards
                    communityAmbassador={communityAmbassador}
                    primaryCards={primaryCards}
                    secondaryCards={secondaryCards}
                />
                <ProgressBar
                    communityEntity={communityEntity?.data?.communityEntity}
                    currency={community?.currency}
                    language={language}
                />
            </Box>
        </ViewContainer>
    );
};

export default Manager;
