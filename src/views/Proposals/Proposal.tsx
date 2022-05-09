import {
    Box,
    Button,
    Card,
    Col,
    Divider,
    Label,
    Row,
    Text
} from '@impact-market/ui';
import { ProposalType } from './ProposalsPage';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useUBICommittee } from '@impact-market/utils';
import CanBeRendered from '../../components/CanBeRendered';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
interface proposalProps {
    data: ProposalType;
    quorum: number;
}

const Proposal: React.FC<proposalProps> = ({ data }) => {
    const [proposals, setProposals] = useState<ProposalType>(data);
    const { execute, vote } = useUBICommittee();
    const objDescription = proposals.description ? JSON.parse(proposals.description) : {};
    const voteRunning = ['active'];
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();
    const { view } = usePrismicData();
    const [loadingButtonNo, toggleLoadingButtonNo] = useState(false);
    const [loadingButtonYes, toggleLoadingButtonYes] = useState(false);
    const [disableButtonNo, toggleDisableButtonNo] = useState(false);
    const [disableButtonYes, toggleDisableButtonYes] = useState(false);
    const [loadingButtonExecute, toggleLoadingButtonExecute] = useState(false);
    const [newVotesFor, setNewVotesFor] = useState(data.votesFor);
    const [newVotesAgainst, setNewVotesAgainst] = useState(data.votesAgainst);

    const handleVote = (a: number) => {
        if (proposals.userVoted === 0) {
            const votesNo = a - 1;
            
            return votesNo;
        }

        if (proposals.userVoted === 1) {
            const votesYes = a - 1;

            return votesYes;
        }
    };
    
    const executeFunction = async (id: number) => {
        try {
            toggleLoadingButtonExecute(true);
            await execute(id);
            setProposals({...proposals, status: 'executed'});
            toggleLoadingButtonExecute(false);
        } catch (error) {
            toggleLoadingButtonExecute(false);
        }
    }

    const voteFunction = async (id: number, votersChoice: number) => {
        try {
            if(votersChoice === 1) {
                toggleLoadingButtonYes(true);
                toggleDisableButtonNo(true);
                await vote(id, 1);
                toggleLoadingButtonYes(false);
                changeVote(1);
            } else {
                toggleLoadingButtonNo(true);
                toggleDisableButtonYes(true);
                await vote(id, 0);
                toggleLoadingButtonNo(false);
                changeVote(0);
            }
        } catch (error) {
            if(votersChoice === 1) {
                toggleLoadingButtonYes(false);
                toggleDisableButtonNo(false);
            } else {
                toggleLoadingButtonNo(false);
                toggleDisableButtonYes(false);
            }
        }
    }

    const handleVoteAgainst = (state: number) => {
        const oldVotesAgainst = data.votesAgainst;

        if(state === 0) {
            setNewVotesAgainst(oldVotesAgainst + 1);

            return oldVotesAgainst + 1;
        }

        return oldVotesAgainst;
    }

    const handleVoteFor = (state: number) => {
        const oldVotesFor = data.votesFor;
        
        if(state === 1) {
            setNewVotesFor(oldVotesFor + 1);

            return oldVotesFor + 1;
        }

        return oldVotesFor;
    }

    const handleStatus = () => {
        if(newVotesFor === 2) {
            return 'ready'
        } 

        if(newVotesAgainst === 2) {
            return 'defeated'
        }

        return data.status  
    }

    const changeVote = (state: number) => {
        setProposals({
            ...proposals,
            status: handleStatus(),
            votesAgainst: handleVoteAgainst(state),
            votesFor: handleVoteFor(state)
        })
    }

    return (
        <Card mt={1}>
            <Text large semibold>
                <String id="proposal" /> #{proposals.id}
            </Text>
            <Row pb={0.25} pt={0.5}>
                <Col colSize={{ sm: 8 , xs: 12}}>
                    <Row>
                        <Text g500 pr={0}>
                            <String id="createdBy" />:
                        </Text>
                        <Text g500 p600 pl={1}>
                            {proposals.proposer}
                        </Text>
                    </Row>
                </Col>

                <Col colSize={{ sm: 4, xs: 12 }} right>
                    {voteRunning?.includes(proposals.status) && (
                        <Label content={t('voteIsRunning')} icon="clock" system />
                    )}

                    {proposals.status === 'defeated' && (
                        <Label content={view.data.stringProposalDeclined} error icon="arrowDown" />
                    )}

                    {proposals.status === 'ready' && (
                        <Label content={view.data.stringProposalApproved} icon="arrowUp" success />
                    )}

                    {proposals.status === 'executed' && (
                        <Label content={view.data.stringProposalExecuted} icon="arrowUp" success />
                    )}

                    {proposals.status === 'expired' && (
                        <Label content={view.data.stringProposalExpired} error icon="arrowDown" />
                    )}

                    {proposals.status === 'canceled' && (
                        <Label content={view.data.stringProposalCanceled} error icon="arrowDown" />
                    )}

                </Col>
            </Row>

            <Divider />
            <Row fLayout="center start">
                <Col pl={0}>
                        {!auth?.type?.includes('subDAOMember') && voteRunning?.includes(proposals.status) &&
                            <Label content={<RichText content={view.data.messageNotAllowedVote}/>} error icon="sad" ml={1} />
                        }

                    <CanBeRendered types={['subDAOMember']}>
                    {proposals.userVoted === -1 && proposals.status === 'active' && (
                        <>
                            <Button disabled={disableButtonNo} error isLoading={loadingButtonNo} ml={1} mr={0.5} onClick={() => voteFunction(proposals.id, 0)} >
                                <String id="decline" />
                            </Button>

                            <Button disabled={disableButtonYes} isLoading={loadingButtonYes} ml={1} onClick={() =>  voteFunction(proposals.id, 1)} success >
                                <String id="accept" />
                            </Button>
                        </>
                    )}

                    {proposals.status === 'ready' && (
                        <Button isLoading={loadingButtonExecute} ml={1} mr={1.938} onClick={() => executeFunction(proposals.id)} >
                            <RichText content={view.data.stringProposalExecuted}/>
                        </Button>
                    )}
                    </CanBeRendered>

                    {proposals.status !== 'active' && (
                        <Label content={t('voteHasEnded')} ml={1} />
                    )}
                </Col>
                <Col pl={0}>
                    <Row>
                        <Box flex pr={0.25}>

                            {proposals.userVoted === 1 && (
                                <>
                                    <Text g800 pl={0.5} semibold>
                                        <String id="you" /> +
                                    </Text>
                                    <Text g800 pl={0.5} pr={0} semibold>
                                        {handleVote(proposals.votesFor)}
                                    </Text>
                                    <Text g500 pl={0.25}>
                                        <String id="votedYes" />
                                    </Text>
                                </>
                            )}

                            {proposals.userVoted !== 1 && (
                                <>
                                    <Text g800 pr={0} semibold>
                                        {proposals.votesFor}
                                    </Text>
                                    <Text g500 pl={0.25}>
                                        <String id="votedYes" />
                                    </Text>
                                </>
                            )}


                            <Text pl={0.5} pr={0.5}>
                                ·
                            </Text>

                            {proposals.userVoted === 0 && (
                                <>
                                    <Text g800 semibold>
                                        <String id="you" /> +
                                    </Text>
                                    <Text g800 pl={0.5} pr={0} semibold>
                                        {handleVote(proposals.votesAgainst)}
                                    </Text>
                                    <Text g500 pl={0.25}>
                                        <String id="votedNo" />
                                    </Text>
                                </>
                            )}

                            {proposals.userVoted !== 0 && (
                                <>
                                    <Text g800 pl={0.5} pr={0} semibold>
                                        {proposals.votesAgainst}
                                    </Text>
                                    <Text g500 pl={0.25}>
                                        <String id="votedNo" />
                                    </Text>
                                </>
                            )}
                        </Box>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Box>
                    <Text mb={1}>{objDescription.title}</Text>
                    <Text>{objDescription.description}</Text>
                </Box>
            </Row>
        </Card>
    );
};

export default Proposal;
