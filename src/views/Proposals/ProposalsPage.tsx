import { Box, Pagination, Row, Spinner } from '@impact-market/ui';
import { useContractKit } from '@celo-tools/use-contractkit';
import { useUBICommittee } from '@impact-market/utils';
import Proposal from './Proposal';
import React, { useEffect, useState } from 'react';

const itemsPerPage = 2;

export interface ProposalType {
    id: number;
    proposer: string;
    signatures: string[];
    endBlock: number;
    description: string;
    votesAgainst: number;
    votesFor: number;
    votesAbstain: number;
    userVoted: number;
    status:
        | 'canceled'
        | 'executed'
        | 'ready'
        | 'defeated'
        | 'expired'
        | 'active';
}

const ProposalsPage = () => {
    const { address } = useContractKit();
    const {
        proposalCount,
        getProposals,
        isReady,
        quorumVotes
    } = useUBICommittee();
    const [proposals, setProposals] = useState<ProposalType[]>([]);
    const [loading, setLoading] = useState(false);

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(proposalCount / itemsPerPage);

    useEffect(() => {
        const getProposalsMethod = async () => {
            try {
                if (isReady) {
                    setLoading(true);

                    const proposalsRequest = await getProposals(itemsPerPage, itemOffset, address || undefined);

                    setProposals(proposalsRequest);

                    setLoading(false);     
                }
                
            } catch (error) {

                console.log(error);
            }
        }

       getProposalsMethod();
    }, [itemOffset, isReady]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        }
    };

    return (
        <>
            {!isReady || loading ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                <Box pb={2}>
                    <Box>
                        {proposalCount > 0 &&
                            proposals.map((p, index) => (
                                <Proposal
                                    data={p}
                                    key={index}
                                    quorum={quorumVotes}
                                />
                            ))}
                    </Box>
                    <Pagination
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        mt={2}
                        nextIcon="arrowRight"
                        nextLabel="Next"
                        pageCount={pageCount}
                        previousIcon="arrowLeft"
                        previousLabel="Previous"
                    />
                </Box>
            )}
        </>
    );
};

export default ProposalsPage;
