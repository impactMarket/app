import {
    Box,
    Button,
    Card,
    Col,
    Display,
    Row,
    Text,
    TextLink,
    toast
} from '@impact-market/ui';
import { CommunityContract, useGetCommunityContractMutation } from '../../api/community';
import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { getCountryNameFromInitials } from '../../utils/countries';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import CanBeRendered from '../../components/CanBeRendered';
import Image from '../../components/Image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';


const Community = ({ data, removeIndex }: any) => {
    const [community] = useState(data);
    const { addCommunity } = useImpactMarketCouncil();
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
                const response = await getCommunityContract(community.id).unwrap();

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
        try {
            setIsLoading(true);

            const response = await addCommunity({
                ...community.contract,
                ambassador: community.ambassadorAddress,
                decreaseStep: toToken(0.01),
                managers: [community.requestByAddress],
                maxTranche: toToken(5, { EXPONENTIAL_AT: 25 }),
                minTranche: toToken(1),
                proposalDescription: `## Description:\n${community.description}\n\nUBI Contract Parameters:\nClaim Amount: ${toNumber(
                    community.contract.claimAmount
                )}\nMax Claim: ${toNumber(
                    community.contract.maxClaim
                )}\nBase Interval: ${frequencyToText(
                    community.contract.baseInterval
                )}\nIncrement Interval: ${
                    (community.contract.incrementInterval * 5) / 60
                } minutes\n\n\nMore details: ${config.baseUrl}/communities/${community.id}`,
                proposalTitle: `[New Community] ${community.name}`
            });

            if (typeof response === 'number') {
                setIsAdded(true);
            }

            setIsLoading(false);
            removeIndex(community.id);
            toast.success(<RichText content={view.data.messageRequestsGenerated}/>);
        } catch (error) {
            toast.error(<RichText content={view.data.messageRequestsNotGenerated}/>);
            setIsLoading(false);
        }
        
    };

    return (
        <Card mt={1}>
            <Row>
                <Col colSize={12}>
                    <Box flex>
                        <Box flex>       
                            <Box pt={8.313} style={{position: 'relative'}} w={8.313}>
                                <Image alt="" src={community.coverMediaPath} style={{borderRadius: '8px'}} />
                            </Box>
                        </Box>
                        <Box  ml={1} w="100%">
                            <Row>
                                <Col colSize={12} fLayout="center">
                                    <Display>{community.name}</Display>
                                    <Box flex>
                                        <Text>{community.city}, {getCountryNameFromInitials(community.country)}</Text>
                                        <Text ml={0.5} mr={0.5}>·</Text>
                                        <Box>
                                            <Link href={`/communities/${community.id}`} passHref>
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
                                            <Button disabled={isLoading} isLoading={!!isLoading} onClick={handleAddCommunity} >
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
