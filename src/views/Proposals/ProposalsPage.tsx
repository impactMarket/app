
import { Box } from '@impact-market/ui';
import { useContractKit, useProvider } from '@celo-tools/use-contractkit';
import { useUBICommittee } from '@impact-market/utils';
import Proposal from './Proposal';
import React, { useEffect, useState } from 'react';

const ProposalsPage= () => {
    const provider = useProvider();
    const { address } = useContractKit();
    const { cancel, execute, getProposals, vote, quorumVotes } = useUBICommittee();
    const [proposals, setProposals] = useState<{
        id: number;
        proposer: string;
        signatures: string[];
        endBlock: number;
        description: string;
        status: number;
        votesAgainst: number;
        votesFor: number;
        votesAbstain: number;
    }[]>([]);
    const [blockNumber, setBlockNumber] = useState(0);

    // Pagination limit and offset
    const limit = 5;
    const offset = 0;

    useEffect(() => {
        if (address) {
            getProposals(limit, offset).then((p) => setProposals(p));
            // provider.getBlockNumber().then((b) => setBlockNumber(b));

            
        }
    }, [address]);

    // if (blockNumber === 0) {
    //     return null;
    // }

    console.log(proposals);

    return (
        <Box>
            {proposals.map((p, index) => <Proposal data={p} key={index}/>)} 
        </Box>
    );
};

export default ProposalsPage;
