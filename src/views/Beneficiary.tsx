/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-nested-ternary */
import { Accordion, AccordionItem, Alert, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer, openModal } from '@impact-market/ui';
import { currencyFormat } from '../utils/currencies';
import { getLocation } from '../utils/position';
import { selectCurrentUser } from '../state/slices/auth';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { useGetCommunityMutation } from '../api/community';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSaveClaimLocationMutation } from '../api/claim';
import { useSelector } from 'react-redux';
import { userBeneficiary } from '../utils/users';
import Image from '../libs/Prismic/components/Image';
import Message from '../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const Beneficiary: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingButton, toggleLoadingButton] = useState(false);
    const [loadingCommunity, toggleLoadingCommunity] = useState(true);
    const [claimAllowed, toggleClaim] = useState(false);
    const [community, setCommunity] = useState({}) as any;

    const { view, extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const auth = useSelector(selectCurrentUser);
    const currency = auth?.user?.currency || 'USD';
    const router = useRouter();
    const { t } = useTranslations();

    // Check if current User has access to this page
    if(!auth?.type?.includes(userBeneficiary)) {
        router.push('/');

        return null;
    }

    const [getCommunity] = useGetCommunityMutation();
    const [saveClaimLocation] = useSaveClaimLocationMutation();

    const { isReady, claimCooldown, claim, isClaimable, beneficiary: { claimedAmount }, community: { claimAmount, hasFunds, maxClaim }, fundsRemainingDays } = useBeneficiary(
        auth?.user?.beneficiary?.community
    );

    // Check if there's a Community with the address associated with the User. If not, return to Homepage
    useEffect(() => {
        const init = async () => {
            try {
                const data = await getCommunity(auth?.user?.beneficiary?.community).unwrap();

                setCommunity(data);

                toggleLoadingCommunity(false);

                // If the User hasn't already accepted the Community Rules, show the modal
                if(!auth?.user?.beneficiaryRules) {
                    openModal('welcomeBeneficiary', {
                        communityImage: data.coverImage,
                        communityName: data.name
                    });
                }
            }
            catch (error) {
                console.log(error);

                router.push('/');

                return false;
            }
        };

        init();
    }, []);

    const claimFunds = async () => {
        try {
            toggleLoadingButton(true);

            const { status } = await claim();

            toggleLoadingButton(false);

            // If the Claim was successfully, get the user coordinates and save them in another request
            if(status) {
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
        }
        catch(error) {
            console.log(error);

            toggleLoadingButton(false);
            toggleClaim(false);
        }
    };

    const allowClaim = () => toggleClaim(true);

    const cardType = !hasFunds ? 1 : !isClaimable && !claimAllowed ? 0 : 2;
    const cardIcon = cardType === 0 ? "clock" : cardType === 1 ? "alertCircle" : "coinStack";
    const cardIconState = cardType === 0 ? { warning: true } : cardType === 1 ? { error: true } : { success: true };
    const cardTitle = view.data.claimCardStates[cardType].title;
    const cardMessage = view.data.claimCardStates[cardType].text;
    const cardImage = view.data.claimCardStates[cardType].image;
    const claimAmountDisplay = currencyFormat(claimAmount, currency);
    
    return (
        <ViewContainer isLoading={!isReady || isLoading || loadingCommunity}>
            {
                fundsRemainingDays <= 3 && fundsRemainingDays > 0 &&
                <Alert icon="alertTriangle" mb={1.5} message={<Message id="communityFundsWillRunOut" variables={{ count: fundsRemainingDays, timeUnit: t("days").toLowerCase() }} />} warning />
            }
            {
                !auth?.user?.active &&
                <Alert error icon="key" mb={1.5} message={<Message id="yourAccountHasBeenLocked" />} />
            }
            <Display g900 medium>
                {title}
            </Display>
            <RichText components={{ OpenRulesModal: ({ children }: any) => <a onClick={() => openModal('communityRules', { communityName: community?.name })}>{children}</a> }} content={content} g500 mt={0.25} variables={{ community: community?.name }} />
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
                                        <RichText content={cardMessage} g500 mt={0.5} small variables={{ amount: claimAmountDisplay }}/>
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
                                                <Button default isLoading={loadingButton} large onClick={claimFunds}>
                                                    <String id="claim" /> ~{claimAmountDisplay}
                                                </Button>
                                            }
                                        </Box>
                                    }
                                </Grid>
                            </Box>
                        </Col>
                        <Col colSize={{ sm: 5, xs: 12 }}>
                            <Image {...cardImage} radius={0.5}/>
                        </Col>
                    </Row>
                </Card>
            }
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