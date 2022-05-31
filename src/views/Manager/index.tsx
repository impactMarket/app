/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Display, ViewContainer } from '@impact-market/ui';
import { getCommunityEntity } from '../../graph/community';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunityAmbassadorMutation, useGetCommunityMutation } from '../../api/community';
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

const Manager: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [community, setCommunity] = useState({}) as any;
    const [communityAmbassador, setCommunityAmbassador] = useState({}) as any;
    const [primaryCards, setPrimaryCards] = useState([]) as any;
    const [secondaryCards] = useState([]) as any;
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const [getCommunity] = useGetCommunityMutation();
    const [getCommunityAmbassador] = useGetCommunityAmbassadorMutation();

    const language = auth?.user?.language || 'en-US';

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    const { canRequestFunds, community: { hasFunds }, fundsRemainingDays, isReady, requestFunds } = useManager(
        auth?.user?.manager?.community
    );

    // TODO: on error should we show any warning?
    const communityEntity = useQuery(getCommunityEntity, { variables: { address: auth?.user?.manager?.community } });

    // Check if there's a Community with the address associated with the User. If not, return to Homepage
    useEffect(() => {
        const init = async () => {
            try {
                const communityData = await getCommunity(auth?.user?.manager?.community).unwrap();
                const communityAmbassador = await getCommunityAmbassador(communityData?.id).unwrap();

                setCommunity(communityData);
                setCommunityAmbassador(communityAmbassador);

                toggleLoadingCommunity(false);
            }
            catch (error) {
                console.log(error);

                router.push('/');

                return false;
            }
        };

        init();
    }, []);

    useEffect(() => {
        // TODO: add final URL's

        setPrimaryCards([
            {
                number: communityEntity?.data?.communityEntity?.beneficiaries || 0,
                title: t('totalBeneficiaries'),
                url: '/manager/beneficiaries'
            },
            {
                number: communityEntity?.data?.communityEntity?.managers || 0,
                title: t('totalManagers'),
                url: '/manager/managers'
            }
        ]);

        // TODO: secondary cards commented by Bernardo request for now, finish them later

        // setSecondaryCards([
        //     {
        //         number: 0,
        //         title: t('suspiciousActivity'),
        //         url: '/manager/beneficiaries'
        //     },
        //     {
        //         number: 0,
        //         title: t('blocked'),
        //         url: '/manager/beneficiaries'
        //     },
        //     {
        //         number: 0,
        //         title: t('active'),
        //         url: '/manager/beneficiaries'
        //     },
        //     {
        //         number: 0,
        //         title: t('inactive'),
        //         url: '/manager/beneficiaries'
        //     }
        // ]);
    }, [communityEntity?.data]);

    return (
        <ViewContainer isLoading={!isReady || isLoading || loadingCommunity || communityEntity?.loading}>
            <Alerts canRequestFunds={canRequestFunds} fundsRemainingDays={fundsRemainingDays} hasFunds={hasFunds} requestFunds={requestFunds} />
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} variables={{ community: community?.name }} />
            <Box column fLayout="start" flex>
                <Cards communityAmbassador={communityAmbassador} primaryCards={primaryCards} secondaryCards={secondaryCards} />
                <ProgressBar communityEntity={communityEntity?.data?.communityEntity} currency={community?.currency} language={language} />
            </Box>
        </ViewContainer>
    );
};

export default Manager;
