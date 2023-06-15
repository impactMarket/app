import { Box, Pagination, Row, Spinner } from '@impact-market/ui';
import { useCelo } from 'react-celo-impactmarket';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import Proposal from './Proposal';
import React, { useEffect, useState } from 'react';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 10;

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
    const { address } = useCelo();
    const {
        proposalCount,
        getProposals,
        isReady,
        quorumVotes
    } = useImpactMarketCouncil();
    const [proposals, setProposals] = useState<ProposalType[]>([]);
    const [loading, setLoading] = useState(false);
    const { update, getByKey } = useFilters();

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(proposalCount / itemsPerPage);
    const [changed, setChanged] = useState<Date>(new Date());
    const [ready, setReady] = useState(false);

    // On page load, check if there's a page or orderBy in the url and save it to state
    useEffect(() => {
        if (!!getByKey('page')) {
            const page = getByKey('page') as any;

            setItemOffset((page - 1) * itemsPerPage);
            setChanged(new Date());
            setCurrentPage(page - 1);
        }

        setReady(true);
    }, []);

    useEffect(() => {
        const getProposalsMethod = async () => {
            try {
                if (isReady) {
                    setLoading(true);

                    const proposalsRequest = await getProposals(
                        itemsPerPage,
                        itemOffset,
                        address || undefined
                    );

                    setProposals(proposalsRequest);

                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (ready) {
            getProposalsMethod();
        }
    }, [itemOffset, isReady, ready, changed]);

    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
            update('page', event.selected + 1);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % proposalCount;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
            update('page', newPage + 1);
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
                        pb={4}
                        previousIcon="arrowLeft"
                        previousLabel="Previous"
                    />
                </Box>
            )}
        </>
    );
};

export default ProposalsPage;
