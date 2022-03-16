/* eslint-disable no-nested-ternary */
import { Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Spinner, Text, ViewContainer } from '@impact-market/ui';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { selectCurrentUser } from '../../app/state/slices/auth';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useSigner } from '../utils/useSigner';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import config from '../../config';

const Beneficiary = () => {
    const [loading, toggleLoading] = useState(false);
    const [claimAllowed, toggleClaim] = useState(false);

    const { translations, view, extractFromView } = usePrismicData();

    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);

    console.log(translations, view);

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
    



    //PASSAR PARA UMA PASTA HELPERS OU HOOKS TALVEZ!!!!
    const cardType = !hasFunds ? 1 : !isClaimable ? 0 : 2;
    const cardIcon = cardType === 0 ? "clock" : cardType === 1 ? "alertCircle" : "coinStack";
    const cardIconState = cardType === 0 ? { warning: true } : cardType === 1 ? { error: true } : { success: true };
    const cardTitle = view.data.claimCardStates[cardType].title;
    const cardMessage = view.data.claimCardStates[cardType].text[0].text;
    const cardImage = cardType === 0 ? "beneficiary_wait.png" : cardType === 1 ? "beneficiary_no_funds.png" : "beneficiary_claim.png";

    //if(!isReady) return <Spinner isActive p700 size={2}/>;





    // VIEW CONTAINER FICA NO APP !!!!



    return (
        <ViewContainer isLoading={!isReady}>
            <Display>
                {title}
            </Display>
            <Text g500>
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
                                        {cardMessage}
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
                <String id="alreadyClaimed" variables={{ claimed: `$${claimedAmount}`, total: `$${maxClaim}` }} />
            </Text>
            <ProgressBar mt={0.5} progress={(claimedAmount / maxClaim) * 100}/>
        </ViewContainer>
    );
};

const WrappedBeneficiary = () => {
    const { address, signer } = useSigner();

    if(address === null || signer === null) return <Spinner isActive p700 size={2}/>;

    return (
        <ImpactProvider address={address} jsonRpc={config.networkRpcUrl} signer={signer}>
            <Beneficiary />
        </ImpactProvider>
    );
};

export default WrappedBeneficiary;
