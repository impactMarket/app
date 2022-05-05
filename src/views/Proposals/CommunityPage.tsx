import {
    Box,
    Button,
    Card,
    Col,
    Display,
    Icon,
    Label,
    Row,
    Spinner,
    Text,
    ViewContainer
} from '@impact-market/ui';
import {
    frequencyToText,
    toNumber,
    toToken,
    useUBICommittee
} from '@impact-market/utils';
import { getCountryNameFromInitials } from '../../utils/countries';
import { getImage } from '../../utils/images';
import { useGetCommunityMutation } from '../../api/community';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import config from '../../../config';

const CommunityPage: React.FC<{ isLoading?: boolean; communityId: any }> = (
    props: any
) => {
    const { isLoading } = props;
    const [loading, setLoading] = useState(false);
    const [getCommunity] = useGetCommunityMutation();
    const [community, setCommunity] = useState({}) as any;
    const [communityId] = useState(props.communityId);
    const { addCommunity } = useUBICommittee();
    const [isAdded, setIsAdded] = useState(false);
    const {
        id,
        name,
        description,
        contract,
        requestByAddress,
        ambassadorAddress
    } = props;

    //  Get community data on first render
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const community: any = await getCommunity(communityId);

                setCommunity(community.data);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, []);

    console.log(community);

    const handleAddCommunity = async () => {
        const response = await addCommunity({
            ...contract,
            ambassador: ambassadorAddress,
            decreaseStep: toToken(0.01),
            managers: [requestByAddress],
            maxTranche: toToken(5, { EXPONENTIAL_AT: 25 }),
            minTranche: toToken(1),
            proposalDescription: `## Description:\n${description}\n\nUBI Contract Parameters:\nClaim Amount: ${toNumber(
                contract.claimAmount
            )}\nMax Claim: ${toNumber(
                contract.maxClaim
            )}\nBase Interval: ${frequencyToText(
                contract.baseInterval
            )}\nIncrement Interval: ${
                (contract.incrementInterval * 5) / 60
            } minutes\n\n\nMore details: ${config.baseUrl}/communities/${id}`,
            proposalTitle: `[New Community] ${name}`
        });

        console.log(response);

        if (typeof response === 'number') {
            setIsAdded(true);
        }
    };

    const getMedia = (filePath: string) =>
        getImage({
            filePath,
            fit: 'cover',
            height: 0,
            width: 0
        });

    return (
        <ViewContainer isLoading={isLoading}>
            {loading ? (
                <Spinner isActive />
            ) : (
                <Box>
                    <Box mb={1.5}>
                        <Link href="/proposals" passHref>
                            <Box as="a">
                                <Label content="Back" icon="arrowLeft" />
                            </Box>
                        </Link>
                    </Box>

                    <Row>
                        <Col colSize={6}>
                            <Box
                                bgImg={() => getMedia(community.coverMediaPath)}
                                h={25}
                                radius={0.5}
                            />
                        </Col>
                        <Col colSize={6}>
                            <Box
                                bgImg={() => getMedia(community.coverMediaPath)}
                                h={25}
                                radius={0.5}
                            />
                        </Col>
                    </Row>
                    <Display mb={1} mt={1}>
                        {community.name}
                    </Display>

                    <Row>
                        <Col colSize={6}>
                            <Box fLayout="center start" flex>
                                {/* TODO location pin ICON */}
                                <Icon icon="users" mr={1} />
                                <Text>
                                    {getCountryNameFromInitials(
                                        community.country
                                    )}
                                    ,
                                </Text>
                                <Text ml={0.2}>{community.city}</Text>
                            </Box>

                            <Box mt={2}>
                                <Text>{community.description}</Text>
                            </Box>
                        </Col>

                        <Col colSize={6} fLayout="center">
                            <Card>
                                {/* TODO Claim amout */}
                                <Text>
                                    Total claim amount per beneficiary is ---
                                </Text>
                                {/* TODO increment */}
                                <Text>
                                    Each claim has a --- minutes increment
                                </Text>

                                {isLoading && <span>...is loading!</span>}
                                {!isAdded && (
                                    <Button
                                        disabled={isLoading}
                                        mt={3}
                                        onClick={handleAddCommunity}
                                    >
                                        Generate Proposal
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Box>
            )}
        </ViewContainer>
    );
};

export default CommunityPage;
