import { Box, Button, Card, Col, Display, Row, Text } from '@impact-market/ui';
import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { getCountryNameFromInitials } from '../../utils/countries';
import { getImage } from '../../utils/images';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee';
import Link from 'next/link';
import React, { useState } from 'react';
import config from '../../../config';

const Community = (props: any) => {
    const {
        baseInterval,
        claimAmount,
        incrementInterval,
        maxClaim,
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

        console.log(response);

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

    //     <li>
    //         <h5 style={{ display: 'flex', width: 600 }}>
    //             <span>
    //                 {name} - {requestByAddress}
    //             </span>
    //             {isLoading && <span>...is loading!</span>}
    //             {!isAdded && (
    //                 <button
    //                     disabled={isLoading}
    //                     onClick={handleAddCommunity}
    //                     style={{ marginLeft: 'auto' }}
    //                 >
    //                     Add
    //                 </button>
    //             )}
    //         </h5>
    //     </li>

    return (
        <Link href={`/proposals/${id}`} passHref>
            <Card mt={1}>
                <Row>
                    <Col colSize={12}>
                        <Box flex>
                            <Box>
                                <Box flex>
                                    <Box
                                        bgImg={() => getMedia(coverMediaPath)}
                                        mr={1}
                                        pt={8.313}
                                        radius={0.5}
                                        w={8.313}
                                    />
                                </Box>
                            </Box>
                            <Box w="100%">
                                <Row>
                                    <Col colSize={12}>
                                        <Display>{name}</Display>
                                        <Box flex>
                                            <Text>
                                                {city},{' '}
                                                {getCountryNameFromInitials(
                                                    country
                                                )}
                                            </Text>
                                            <Text ml={0.5} mr={0.5}>
                                                ·
                                            </Text>
                                            <Box>
                                                <Text p600 semibold>
                                                    See more...
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col colSize={9}>
                                        <Text>
                                            Total claim amount per beneficiary
                                            is {maxClaim} ------NOT WORKING
                                        </Text>
                                        <Text>
                                            Each claim has a minutes{' '}
                                            {incrementInterval} increment
                                            ----------NOT WORKING
                                        </Text>
                                    </Col>
                                    <Col colSize={3} right>
                                        {isLoading && (
                                            <span>...is loading!</span>
                                        )}
                                        {!isAdded && (
                                            <Button
                                                disabled={isLoading}
                                                onClick={handleAddCommunity}
                                            >
                                                Generate Proposal
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Box>
                        </Box>
                    </Col>
                </Row>
            </Card>
        </Link>
    );
};

export default Community;
