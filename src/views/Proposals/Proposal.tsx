import {
    Box,
    Button,
    Card,
    Col,
    Divider,
    Label,
    Row,
    Text,
    toast
} from '@impact-market/ui';
import { ProposalType } from './ProposalsPage';
import { selectCurrentUser } from '../../state/slices/auth';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import CanBeRendered from '../../components/CanBeRendered';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
interface proposalProps {
    data: ProposalType;
    quorum: number;
}

const Proposal: React.FC<proposalProps> = ({ data, quorum }) => {
    const { execute, vote } = useImpactMarketCouncil();
    const { t } = useTranslations();
    const { view } = usePrismicData();
    const [proposals, setProposals] = useState<ProposalType>(data);
    const [loadingButtonYes, toggleLoadingButtonYes] = useState<boolean | undefined>();
    const [loadingButtonExecute, toggleLoadingButtonExecute] = useState(false);
    const objDescription = proposals.description ? JSON.parse(proposals.description) : {};
    const voteRunning = ['active'];
    const auth = useSelector(selectCurrentUser);

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
            setProposals({ ...proposals, status: 'executed' });
            toggleLoadingButtonExecute(false);
            toast.success(<RichText content={view.data.messageProposalsExecuted}/>);
        } catch (error) {
            toast.error(<RichText content={view.data.messageProposalsNotExecuted}/>);
            toggleLoadingButtonExecute(false);
        }
    };

    const voteFunction = async (id: number, votersChoice: number) => {
        try {
            toggleLoadingButtonYes(votersChoice === 1);
            await vote(id, votersChoice === 1 ? 1 : 0);
            
            setProposals((oldValue) => ({
                ...oldValue,
                status: handleStatus( oldValue.votesFor, oldValue.votesAgainst, oldValue.status, votersChoice ),
                userVoted: votersChoice,
                votesAgainst: votersChoice === 0 ? oldValue.votesAgainst + 1 : oldValue.votesAgainst,
                votesFor: votersChoice === 1 ? oldValue.votesFor + 1 : oldValue.votesFor
            }));
            toggleLoadingButtonYes(undefined);
            toast.success(<RichText content={view.data.messageVoteRegistered}/>);
        } catch (error) {
            toast.error(<RichText content={view.data.messageVoteNotRegistered}/>);
            toggleLoadingButtonYes(undefined);
        }
    };

    const handleStatus = (
        votesFor: number,
        votesAgainst: number,
        oldStatus: 'canceled' | 'executed' | 'ready' | 'defeated' | 'expired' | 'active',
        state: number
    ) => {
        if (state === 0 && votesAgainst + 1 === quorum) {
            return 'defeated';
        }
        
        if (state === 1 && votesFor + 1 === quorum) {
            return 'ready';
        }

        return oldStatus;
    };

    return (
        <Card mt={1}>
            <Text large semibold>
                <String id="proposal" /> #{proposals.id}
            </Text>
            <Row pb={0.25} pt={0.5}>
                <Col colSize={{ sm: 8, xs: 12 }}>
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
                    {!auth?.type?.includes('councilMember') &&
                        voteRunning?.includes(proposals.status) && (
                            <Label content={<RichText content={view.data.messageNotAllowedVote}/>} error icon="sad" ml={1} />
                        )}

                    <CanBeRendered types={['councilMember']}>
                        {proposals.userVoted === -1 &&
                            proposals.status === 'active' && (
                                <>
                                    <Button
                                        disabled={loadingButtonYes}
                                        error
                                        isLoading={loadingButtonYes === false}
                                        ml={1}
                                        mr={0.5}
                                        onClick={() => voteFunction(proposals.id, 0)}
                                    >
                                        <String id="decline" />
                                    </Button>

                                    <Button
                                        disabled={loadingButtonYes === false}
                                        isLoading={loadingButtonYes}
                                        ml={1}
                                        onClick={() =>
                                            voteFunction(proposals.id, 1)
                                        }
                                        success
                                    >
                                        <String id="accept" />
                                    </Button>
                                </>
                            )}

                        {proposals.status === 'ready' && (
                            <Button isLoading={loadingButtonExecute} ml={1} mr={1.938} onClick={() => executeFunction(proposals.id)}>
                                <RichText content={view.data.stringExecuteProposal} />
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
