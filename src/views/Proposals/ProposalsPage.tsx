
import { Box, Spinner, ViewContainer } from '@impact-market/ui';
import { useContractKit, useProvider } from '@celo-tools/use-contractkit';
import { useUBICommittee } from '@impact-market/utils';
import Proposal from './Proposal';
import React, { useEffect, useState } from 'react';

const ProposalsPage= (props: any) => {
    const provider = useProvider();
    const { address } = useContractKit();
    const { proposalCount, getProposals} = useUBICommittee();
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
        userHasVoted?: boolean;
    }[]>([]);
    const [blockNumber, setBlockNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isLoading } = props;

    // Pagination limit and offset
    const limit = 10;
    const offset = 0;

    useEffect(() => {
        if (address) {
            setLoading(true);

            console.log('antes');

            getProposals(limit, offset, address).then((p) => setProposals(p));
            provider.getBlockNumber().then((b) => setBlockNumber(b));

            setLoading(false);

            console.log('depois');

        }
    }, [address]);

    if (blockNumber === 0) {
        return null;
    }

  // console.log(proposals);

    return (
        <ViewContainer isLoading={isLoading || loading}>
            <Box>
                {proposals.map((p, index) => <Proposal data={p} key={index}/>)} 
            </Box>
        </ViewContainer>
    );
};

export default ProposalsPage;
