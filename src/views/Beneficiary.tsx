/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-nested-ternary */
import { Accordion, AccordionItem, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer } from '@impact-market/ui';
import { currencyFormat } from '../utils/currencyFormat';
import { selectCurrentUser } from '../state/slices/auth';
import { selectRates } from '../state/slices/rates';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { useGetCommunityByIdQuery, useGetCommunityMutation } from '../api/community';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Image from '../libs/Prismic/components/Image';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

const Beneficiary: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loading, toggleLoading] = useState(false);
    const [claimAllowed, toggleClaim] = useState(false);
    const [currency, setCurrency] = useState('USD');
    
    const { view, extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const rates = useSelector(selectRates);
    const router = useRouter();

    if(!auth?.user?.beneficiary) {
        router.push('/');
    }

    // const community = useGetCommunityByIdQuery(auth?.user?.beneficiary?.community) as any;
    const [getCommunity] = useGetCommunityMutation();

    // console.log(community);
    // if(!community?.isSuccess || !community?.data?.data) {
    //     returnHomepage();
    // }

    useEffect(() => {
        const init = async () => {
            const community = await getCommunity(auth?.user?.beneficiary?.community).unwrap();

            console.log(rates);

            console.log(community);

            if(!community) {
                router.push('/');
            }

            if(community.currency !== 'USD') {
                setCurrency(community.currency);
            }
        };

        init();
    }, []);

    const { isReady, claimCooldown, claim, isClaimable, beneficiary: { claimedAmount }, community: { hasFunds, maxClaim } } = useBeneficiary(
        auth?.user?.beneficiary?.community
    );

    const claimFunds = () => {
        toggleLoading(true);

        claim().then(() => toggleLoading(false)).catch(() => { toggleLoading(false); toggleClaim(false); });
    };

    const allowClaim = () => toggleClaim(true);

    const cardType = !hasFunds ? 1 : !isClaimable ? 0 : 2;
    const cardIcon = cardType === 0 ? "clock" : cardType === 1 ? "alertCircle" : "coinStack";
    const cardIconState = cardType === 0 ? { warning: true } : cardType === 1 ? { error: true } : { success: true };
    const cardTitle = view.data.claimCardStates[cardType].title;
    const cardMessage = view.data.claimCardStates[cardType].text;
    const cardImage = view.data.claimCardStates[cardType].image;

    return (
        <ViewContainer isLoading={!isReady || isLoading}>
            <Display>
                {title}
            </Display>
            <Text g500 mt={0.25}>
                <RichText content={content} />
             </Text>
            <Card mt={2}>
                <Row fLayout="center">
                    <Col colSize={7}>
                        <Box center>
                            <Grid colSpan={1.25} cols={1}>
                                <CircledIcon icon={cardIcon} large {...cardIconState} />
                                <Box>
                                    <Text g900 large medium>
                                        {cardTitle}
                                    </Text>
                                    <Text g500 mt={0.5} small>
                                        <RichText content={cardMessage} />
                                    </Text>
                                </Box>
                                {
                                    hasFunds &&
                                    <Box margin="0 auto" maxW={22}>
                                        {
                                            !isClaimable &&
                                            <Countdown date={new Date(claimCooldown)} onEnd={allowClaim} />
                                        }
                                        {
                                            (isClaimable || claimAllowed) &&
                                            <Button default isLoading={loading} large onClick={claimFunds}>
                                                <String id="claim" />
                                            </Button>
                                        }
                                    </Box>
                                }
                            </Grid>
                        </Box>
                    </Col>
                    <Col colSize={5}>
                        <Image {...cardImage} radius={0.5}/>
                    </Col>
                </Row>
            </Card>
            <Text g500 mt={2} small>
                <String id="alreadyClaimed" variables={{ claimed: currencyFormat(claimedAmount, currency), total: currencyFormat(maxClaim, currency) }} />
            </Text>
            <ProgressBar mt={0.5} progress={(claimedAmount / maxClaim) * 100}/>
            {
                view?.data?.faq?.length > 0 &&
                <Accordion mt={2}>
                    {
                        view.data.faq.map((faq: any, index: number) =>
                            <AccordionItem key={index} title={faq.title}>
                                <Text>
                                <RichText content={faq.content} />
                                </Text>
                            </AccordionItem>
                        )
                    }
                </Accordion>
            }
        </ViewContainer>
    );
};

export default Beneficiary;
