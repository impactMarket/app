import {
    Box,
    Button,
    Card,
    Col,
    Display,
    Row,
    Text,
    TextLink,
} from '@impact-market/ui';
import {
    CommunityContract,
    useGetCommunityContractMutation
} from '../../api/community';
import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { getCountryNameFromInitials } from '../../utils/countries';
import { getImage } from '../../utils/images';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee';
import CanBeRendered from '../../components/CanBeRendered';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';

const Community = (props: any) => {
    const {
        city,
        country,
        id,
        name,
        description,
        coverMediaPath,
        contract,
        requestByAddress,
        ambassadorAddress
    } = props;
    const { addCommunity } = useUBICommittee();
    const [isLoading, setIsLoading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [getCommunityContract] = useGetCommunityContractMutation();
    const [
        communityContract,
        setCommunityContract
    ] = useState<CommunityContract>();
    const { view } = usePrismicData();

    useEffect(() => {
        const getCommunityContractMethod = async () => {
            try {
                setIsLoading(true);
                const response = await getCommunityContract(id).unwrap();

                setCommunityContract(response);

                setIsLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        getCommunityContractMethod();
    }, []);

    const handleAddCommunity = async () => {
        setIsLoading(true);

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

        if (typeof response === 'number') {
            setIsAdded(true);
        }

        setIsLoading(false);
    };

    const getMedia = (filePath: string) =>
        getImage({
            filePath,
            fit: 'cover',
            height: 0,
            width: 0
        });

    return (
        <Card mt={1}>
            <Row>
                <Col colSize={12}>
                    <Box flex>
                        <Box>
                            <Box flex>
                                <Box
                                    bgImg={getMedia(coverMediaPath)}
                                    mr={1}
                                    pt={8.313}
                                    radius={0.5}
                                    w={8.313}
                                />
                            </Box>
                        </Box>
                        <Box w="100%">
                            <Row>
                                <Col colSize={12} fLayout="center">
                                    <Display>{name}</Display>
                                    <Box flex>
                                        <Text>
                                            {city},{' '}
                                            {getCountryNameFromInitials(country)}
                                        </Text>
                                        <Text ml={0.5} mr={0.5}>
                                            ·
                                        </Text>
                                        <Box>
                                            <Link href={`/communities/${id}`} passHref>
                                                <Text>
                                                    <TextLink medium>
                                                        <String id="seeMore" />...
                                                    </TextLink>
                                                </Text>
                                            </Link>
                                        </Box>
                                    </Box>
                                </Col>
                            </Row>

                            <Row>
                                <Col colSize={9}>
                                    <RichText content={view.data.messageTotalClaimAmount} variables={{ total: communityContract?.data?.maxClaim }}/>
                                    <RichText content={view.data.messageMinutesIncrement} variables={{ minutes: communityContract?.data?.incrementInterval }}/>
                                </Col>

                                <Col colSize={3} right>
                                    <CanBeRendered types={['subDAOMember']}>
                                        {!isAdded && (
                                            <Button
                                                disabled={isLoading}
                                                isLoading={!!isLoading}
                                                onClick={handleAddCommunity}
                                            >
                                                <String id="generateProposal" />
                                            </Button>
                                        )}
                                    </CanBeRendered>
                                </Col>
                            </Row>
                        </Box>
                    </Box>
                </Col>
            </Row>
        </Card>
    );
};

export default Community;
