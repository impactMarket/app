/* eslint-disable no-nested-ternary */
import { Accordion, AccordionItem, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer } from '@impact-market/ui';
import { currencyFormat } from '../utils/currencyFormat';
import { selectCurrentUser } from '../state/slices/auth';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const Beneficiary: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loading, toggleLoading] = useState(false);
    const [claimAllowed, toggleClaim] = useState(false);
    
    const { view, extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    console.log(view);
    const auth = useSelector(selectCurrentUser);

    if(!auth?.user?.beneficiary) return <div>User is not Beneficiary!</div>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    const cardImage = cardType === 0 ? "beneficiary_wait.png" : cardType === 1 ? "beneficiary_no_funds.png" : "beneficiary_claim.png";

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
                        <Box bgImg={`/img/${cardImage}`} pt="100%" radius={0.5} />
                    </Col>
                </Row>
            </Card>
            <Text g500 mt={2} small>
                <String id="alreadyClaimed" variables={{ claimed: currencyFormat(claimedAmount, '$'), total: currencyFormat(maxClaim, '$') }} />
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
