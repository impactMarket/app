/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-nested-ternary */
import * as Sentry from "@sentry/nextjs";
import { Accordion, AccordionItem, Alert, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, Row, Text, ViewContainer, openModal, toast } from '@impact-market/ui';
import { checkUserPermission, userBeneficiary } from '../utils/users';
import { currencyFormat } from '../utils/currencies';
import { getLocation } from '../utils/position';
import { gql, useQuery } from '@apollo/client';
import { selectCurrentUser } from '../state/slices/auth';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSaveClaimLocationMutation } from '../api/claim';
import { useSelector } from 'react-redux';
import Image from '../libs/Prismic/components/Image';
import Message from '../libs/Prismic/components/Message';
import ProgressBar from '../components/ProgressBar';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import TextLink from '../components/TextLink';
import config from '../../config';
import useCommunity from '../hooks/useCommunity';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const fetcher = (url: string, headers: any | {}) => fetch(config.baseApiUrl + url, headers).then((res) => res.json());

//  Get increment interval from thegraph
const communityQuery = gql`
query communityQuery($id: String!) {
    communityEntity(id: $id) {
        incrementInterval
    }
}
`;

const Beneficiary: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingButton, toggleLoadingButton] = useState(false);
    const [claimAllowed, toggleClaim] = useState(false);

    const { view, extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });
    const router = useRouter();
    const { t } = useTranslations();

    // Check if current User has access to this page
    if(!checkUserPermission([userBeneficiary])) {
        router.push('/');

        return null;
    }

    const [saveClaimLocation] = useSaveClaimLocationMutation();

    const { data: queryInterval } = useQuery(communityQuery, {
        variables: { 
            id: auth?.user?.beneficiary?.community?.toLowerCase(), 
        },
    });

    const { isReady, claimCooldown, claim, isClaimable, beneficiary: { claimedAmount }, community: { claimAmount, hasFunds, maxClaim }, fundsRemainingDays } = useBeneficiary(
        auth?.user?.beneficiary?.community
    );

    const { community, loadingCommunity } = useCommunity(auth?.user?.beneficiary?.community, fetcher);

    // If the User hasn't already accepted the Community Rules, show the modal
    useEffect(() => {
        if(!auth?.user?.beneficiaryRules) {
            openModal('welcomeBeneficiary', {
                communityImage: community?.coverImage,
                communityName: community?.name
            });
        }
    }, [])

    const claimFunds = async () => {
        try {
            toggleLoadingButton(true);

            const { status } = await claim();

            toggleLoadingButton(false);

            // If the Claim was successfully, get the user coordinates and save them in another request
            if(status) {
                try {
                    const position = await getLocation() as any;

                    if(position?.coords?.latitude && position?.coords?.longitude) {
                        await saveClaimLocation({
                            communityId: community?.id,
                            gps: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                        });
                    }
                }
                catch(error) {
                    console.log(error);
                }
                
                toast.success(<Message id="successfullyClaimedUbi" />);
            }
        }
        catch(error) {
            console.log(error);
            Sentry.captureException(error);

            toggleLoadingButton(false);
            toggleClaim(false);

            toast.error(<Message id="errorUbi" />);
        }
    };

    const allowClaim = () => toggleClaim(true);

    const scrollIntoView = (isActive: boolean, el: HTMLElement) => {
        setTimeout(() => {
            if (!isActive) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            };
        }, 300);
    };

    const cardType = isClaimable ? (hasFunds ? 2 : 1) : 0    
    const cardIcon = cardType === 0 ? "clock" : cardType === 1 ? "alertCircle" : "coinStack";
    const cardIconState = cardType === 0 ? { warning: true } : cardType === 1 ? { error: true } : { success: true };
    const cardTitle = view.data.claimCardStates[cardType].title;
    const cardMessage = view.data.claimCardStates[cardType].text;
    const cardImage = view.data.claimCardStates[cardType].image;
    const claimAmountDisplay = currencyFormat(claimAmount, localeCurrency);

    return (
        <ViewContainer isLoading={!isReady || isLoading || loadingCommunity}>
            {
                fundsRemainingDays <= 3 && fundsRemainingDays > 0 &&
                <Alert icon="alertTriangle" mb={1.5} message={<Message id="communityFundsWillRunOut" medium small variables={{ count: fundsRemainingDays, timeUnit: t("days").toLowerCase() }} />} warning />
            }
            {
                !hasFunds &&
                <Alert error icon="alertCircle" mb={1.5} message={<Message id="communityFundsHaveRunOut" medium small/>} />
            }
            {
                !auth?.user?.active &&
                <Alert error icon="key" mb={1.5} message={<Message id="yourAccountHasBeenLocked" medium small />} />
            }
            <Display g900 medium>
                {title}
            </Display>
            <RichText 
                components={{ 
                    CommunityLink: ({ children }: any) => <TextLink onClick={() => router.push(`/communities/${community?.id}`)}>{children}</TextLink>,
                    OpenRulesModal: ({ children }: any) =>
                        <TextLink onClick={() => openModal('communityRules', { communityName: community?.name })}>{children}</TextLink>
                }} 
                content={content} 
                g500 
                mt={0.25} 
                variables={{ community: community?.name }} 
            />
             {
                auth?.user?.active &&
                <Card mt={2}>
                    <Row fLayout="center">
                        <Col colSize={{ sm: 7, xs: 12 }}>
                            <Box center>
                                <Grid colSpan={1.25} cols={1}>
                                    <CircledIcon icon={cardIcon} large {...cardIconState} />
                                    <Box>
                                        <Text g900 large medium>
                                            {cardTitle}
                                        </Text>
                                        {!isClaimable &&
                                            <RichText content={cardMessage} g500 mt={0.5} small variables={{ amount: claimAmountDisplay }}/>
                                        }
                                        {((isClaimable || claimAllowed) && hasFunds) &&
                                            <RichText content={cardMessage} g500 mt={0.5} small variables={{ time: queryInterval?.communityEntity?.incrementInterval / 12 }}/>
                                        }            
                                    </Box>
                                        <Box margin="0 auto" maxW={22}>
                                            {!isClaimable &&
                                                <Countdown date={new Date(claimCooldown)} onEnd={allowClaim} withDays />
                                            }
                                            {((isClaimable || claimAllowed) && hasFunds) &&
                                                <Button default disabled={loadingButton} isLoading={loadingButton} large onClick={claimFunds}>
                                                    <String id="claim" /> ~{claimAmountDisplay}
                                                </Button>
                                            }                                        
                                        </Box>
                                    

                                </Grid>
                            </Box>
                        </Col>
                        <Col colSize={{ sm: 5, xs: 12 }}>
                            <Image {...cardImage} radius={0.5}/>
                        </Col>
                    </Row>
                </Card>
            }
            <Box mt={2}>
                <ProgressBar
                    progress={(claimedAmount / maxClaim) * 100}
                    state={{ info: true }}
                    title={<Text g500><String id="alreadyClaimed" variables={{ claimed: currencyFormat(claimedAmount, localeCurrency), total: currencyFormat(maxClaim, localeCurrency) }} /></Text>}
                />
            </Box>
            {
                view?.data?.faq?.length > 0 &&
                <Accordion mt={2}>
                    {
                        view.data.faq.map((faq: any, index: number) =>
                            <AccordionItem key={index} scrollIntoView={scrollIntoView} title={faq.title}>
                                <RichText content={faq.content} g500 small />
                            </AccordionItem>
                        )
                    }
                </Accordion>
            }
        </ViewContainer>
    );
};

export default Beneficiary;