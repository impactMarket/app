import { Box, Button, Card, Display } from '@impact-market/ui';
import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { getImage } from '../../utils/images';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee';
import React, { useState } from 'react';
import config from '../../../config';

const Community = (props: any) => {
    const {
        id,
        name,
        description,
        coverMediaPath,
        contract,
        requestByAddress,
        ambassadorAddress,
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

    return (
        <Box>
        {/* //     <li>
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
        //     </li> */}
            
            
             <Card mt={1}>
                <Box flex>
                    <Box
                        bgImg={() => getMedia(coverMediaPath)}
                        mr={1}
                        pt={8.313}
                        radius={0.5}
                        w={8.313}
                    />

                    <Display >
                        {name}
                    </Display>
                </Box>
                {isLoading && <span>...is loading!</span>}
                {!isAdded && (
                    <Button  disabled={isLoading} onClick={handleAddCommunity}>Generate Proposal</Button>
                )}

            </Card>
        </Box>
    );
};

export default Community;
