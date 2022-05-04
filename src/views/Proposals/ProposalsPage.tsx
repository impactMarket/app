
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

    useEffect(() => {
        if (address) {
            getProposals(5, 0).then((p) => setProposals(p));
            // provider.getBlockNumber().then((b) => setBlockNumber(b));
        }
    }, [address]);

    console.log(proposals);
    
    // if (blockNumber === 0) {
    //     return null;
    // }

    

    return (
        <div>
            <h3>Proposals ({quorumVotes} quorumVotes)</h3>
            {proposals.map((p, index) => <Proposal key={index} p={p} />)} 
        </div>
    );
};

export default ProposalsPage;
