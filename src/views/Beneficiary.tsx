/* eslint-disable no-nested-ternary */
import {
    Accordion,
    AccordionItem,
    Alert,
    Box,
    Button,
    Card,
    CircledIcon,
    Col,
    Countdown,
    Display,
    Grid,
    Row,
    Text,
    ViewContainer,
    openModal,
    toast
} from '@impact-market/ui';
import {
    RequestFundsStatus,
    useBeneficiary
} from '@impact-market/utils/useBeneficiary';
import { checkUserPermission, userBeneficiary } from '../utils/users';
import { currencyFormat } from '../utils/currencies';
import { getLocation } from '../utils/position';
import { gql, useQuery } from '@apollo/client';
import { handleKnownErrors } from '../helpers/handleKnownErrors';
import { selectCurrentUser } from '../state/slices/auth';
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
import processTransactionError from '../utils/processTransactionError';
import styled from 'styled-components';
import useCommunity from '../hooks/useCommunity';

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

//  Get increment interval from thegraph
const communityQuery = gql`
    query communityQuery($id: String!) {
        communityEntity(id: $id) {
            incrementInterval
        }
    }
`;

const AccordionComponent = styled(Accordion)`
    a {
        flex-wrap: wrap;
        max-width: 100%;
    }

    p {
        max-width: 100%;
    }
`;

const Beneficiary: React.FC<{ isLoading?: boolean }> = (props) => {
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

    // Check if current User has access to this page
    if (!checkUserPermission([userBeneficiary])) {
        router.push('/');

        return null;
    }

    const [saveClaimLocation] = useSaveClaimLocationMutation();

    const { data: queryInterval } = useQuery(communityQuery, {
        variables: {
            id: auth?.user?.beneficiary?.community?.toLowerCase()
        }
    });

    const {
        isReady,
        claim,
        beneficiary: {
            claimedAmount,
            claimCooldown,
            isClaimable,
            community: { claimAmount, maxClaim, requestFundsStatus }
        }
    } = useBeneficiary(auth?.user?.beneficiary?.community);

    const { community, loadingCommunity } = useCommunity(
        auth?.user?.beneficiary?.community,
        fetcher
    );

    // If the User hasn't already accepted the Community Rules, show the modal
    useEffect(() => {
        if (!auth?.user?.beneficiaryRules) {
            openModal('welcomeBeneficiary', {
                communityImage: community?.coverImage,
                communityName: community?.name
            });
        }
    }, []);

    const claimFunds = async () => {
        try {
            toggleLoadingButton(true);

            toast.info(<Message id="approveTransaction" />);
            await claim().then(({ status }) => {
                if (status) {
                    const communityPosition: {
                        latitude: number;
                        longitude: number;
                    } = community?.gps;
                    const communityLocation = { coords: communityPosition };

                    navigator?.permissions
                        ?.query({ name: 'geolocation' })
                        .then(async (permissionStatus) => {
                            if (permissionStatus?.state === 'granted') {
                                return (await getLocation()) as {
                                    coords: {
                                        latitude: number | null;
                                        longitude: number | null;
                                    };
                                };
                            }
                        })
                        .then(async (location) => {
                            const claimLocation = location ?? communityLocation;

                            await saveClaimLocation({
                                communityId: community?.id,
                                gps: {
                                    latitude: claimLocation?.coords?.latitude,
                                    longitude: claimLocation?.coords?.longitude
                                }
                            });
                        });
                }
            });

            toggleLoadingButton(false);
            toggleClaim(false);

            toast.success(<Message id="successfullyClaimedUbi" />);
        } catch (error: any) {
            handleKnownErrors(error);

            processTransactionError(error, 'claim');

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
            }
        }, 300);
    };

    const [cardType, setCardType] = useState(0);
    const [cardIcon, setCardIcon] = useState('clock');
    const [cardIconState, setCardIconState] = useState({
        warning: true
    }) as any;
    const [cardTitle, setCardTitle] = useState('');
    const [cardMessage, setCardMessage] = useState('');
    const [cardImage, setCardImage] = useState('') as any;
    const claimAmountDisplay = currencyFormat(claimAmount, localeCurrency);

    useEffect(() => {
        if (isClaimable || claimAllowed) {
            if (requestFundsStatus === RequestFundsStatus.READY) {
                setCardType(2);
            } else if (requestFundsStatus === RequestFundsStatus.NOT_YET) {
                setCardType(3);
            } else {
                setCardType(1);
            }
        } else {
            setCardType(0);
        }
    }, [isClaimable, requestFundsStatus, claimAllowed]);

    useEffect(() => {
        setCardIcon(
            cardType === 0
                ? 'clock'
                : cardType === 1
                  ? 'alertCircle'
                  : 'coinStack'
        );
        setCardIconState(
            cardType === 0
                ? { warning: true }
                : cardType === 1
                  ? { error: true }
                  : { success: true }
        );
        setCardTitle(view.data.claimCardStates[cardType].title);
        setCardMessage(view.data.claimCardStates[cardType].text);
        setCardImage(view.data.claimCardStates[cardType].image);
    }, [cardType]);

    return (
        <ViewContainer
            {...({} as any)}
            isLoading={!isReady || isLoading || loadingCommunity}
        >
            {!auth?.user?.active && (
                <Alert
                    error
                    icon="key"
                    mb={1.5}
                    message={
                        <Message id="yourAccountHasBeenLocked" medium small />
                    }
                />
            )}
            {requestFundsStatus === RequestFundsStatus.NOT_ENOUGH_FUNDS && (
                <Alert
                    error
                    icon="alertCircle"
                    mb={1.5}
                    message={
                        <Message id="communityFundsHaveRunOut" medium small />
                    }
                />
            )}
            {requestFundsStatus === RequestFundsStatus.NOT_YET && (
                <Alert
                    error
                    icon="alertCircle"
                    mb={1.5}
                    message={<Message id="communityFundsNotYet" medium small />}
                />
            )}

            <Display g900 medium>
                {title}
            </Display>
            <RichText
                components={{
                    CommunityLink: ({ children }: any) => (
                        <TextLink
                            onClick={() =>
                                router.push(`/communities/${community?.id}`)
                            }
                        >
                            {children}
                        </TextLink>
                    ),
                    OpenRulesModal: ({ children }: any) => (
                        <TextLink
                            onClick={() =>
                                openModal('communityRules', {
                                    communityName: community?.name
                                })
                            }
                        >
                            {children}
                        </TextLink>
                    )
                }}
                content={content}
                g500
                mt={0.25}
                variables={{ community: community?.name }}
            />
            {auth?.user?.active && (
                <Card mt={2}>
                    <Row fLayout="center">
                        <Col colSize={{ sm: 7, xs: 12 }}>
                            <Box center>
                                <Grid {...({} as any)} colSpan={1.25} cols={1}>
                                    <CircledIcon
                                        icon={cardIcon}
                                        large
                                        {...cardIconState}
                                    />
                                    <Box>
                                        <Text g900 large medium>
                                            {cardTitle}
                                        </Text>
                                        <RichText
                                            content={cardMessage}
                                            g500
                                            mt={0.5}
                                            small
                                            variables={{
                                                // Is not claimable
                                                amount:
                                                    !isClaimable &&
                                                    !claimAllowed &&
                                                    claimAmountDisplay,
                                                // Is claimable
                                                time:
                                                    (isClaimable ||
                                                        claimAllowed) &&
                                                    requestFundsStatus ===
                                                        RequestFundsStatus.READY &&
                                                    queryInterval
                                                        ?.communityEntity
                                                        ?.incrementInterval / 12
                                            }}
                                        />
                                    </Box>
                                    <Box margin="0 auto" maxW={22}>
                                        {!isClaimable && !claimAllowed && (
                                            <Countdown
                                                date={new Date(claimCooldown)}
                                                onEnd={allowClaim}
                                                withDays
                                            />
                                        )}
                                        {(isClaimable || claimAllowed) &&
                                            requestFundsStatus ===
                                                RequestFundsStatus.READY && (
                                                <Button
                                                    default
                                                    disabled={loadingButton}
                                                    isLoading={loadingButton}
                                                    large
                                                    onClick={claimFunds}
                                                >
                                                    <String id="claim" /> ~
                                                    {claimAmountDisplay}
                                                </Button>
                                            )}
                                    </Box>
                                </Grid>
                            </Box>
                        </Col>
                        <Col colSize={{ sm: 5, xs: 12 }}>
                            <Image {...cardImage} radius={0.5} />
                        </Col>
                    </Row>
                </Card>
            )}
            <Box mt={2}>
                <ProgressBar
                    progress={(claimedAmount / maxClaim) * 100}
                    state={{ info: true }}
                    title={
                        <Text g500>
                            <String
                                id="alreadyClaimed"
                                variables={{
                                    claimed: currencyFormat(
                                        claimedAmount,
                                        localeCurrency
                                    ),
                                    total: currencyFormat(
                                        maxClaim,
                                        localeCurrency
                                    )
                                }}
                            />
                        </Text>
                    }
                />
            </Box>
            {view?.data?.faq?.length > 0 && (
                <AccordionComponent mt={2}>
                    {view.data.faq.map((faq: any, index: number) => (
                        <AccordionItem
                            key={index}
                            scrollIntoView={scrollIntoView}
                            title={faq.title}
                        >
                            <RichText content={faq.content} g500 small />
                        </AccordionItem>
                    ))}
                </AccordionComponent>
            )}
        </ViewContainer>
    );
};

export default Beneficiary;
