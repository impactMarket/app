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
    const [loadingButtonYes, toggleLoadingButtonYes] = useState<
        boolean | undefined
    >();
    const [loadingButtonExecute, toggleLoadingButtonExecute] = useState(false);
    const objDescription = proposals.description
        ? JSON.parse(proposals.description)
        : {};
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
            toast.success(
                <RichText content={view.data.messageProposalsExecuted} />
            );
        } catch (error) {
            toast.error(
                <RichText content={view.data.messageProposalsNotExecuted} />
            );
            toggleLoadingButtonExecute(false);
        }
    };

    const voteFunction = async (id: number, votersChoice: number) => {
        try {
            toggleLoadingButtonYes(votersChoice === 1);
            await vote(id, votersChoice === 1 ? 1 : 0);

            setProposals((oldValue) => ({
                ...oldValue,
                status: handleStatus(
                    oldValue.votesFor,
                    oldValue.votesAgainst,
                    oldValue.status,
                    votersChoice
                ),
                userVoted: votersChoice,
                votesAgainst:
                    votersChoice === 0
                        ? oldValue.votesAgainst + 1
                        : oldValue.votesAgainst,
                votesFor:
                    votersChoice === 1
                        ? oldValue.votesFor + 1
                        : oldValue.votesFor
            }));
            toggleLoadingButtonYes(undefined);
            toast.success(
                <RichText content={view.data.messageVoteRegistered} />
            );
        } catch (error) {
            toast.error(
                <RichText content={view.data.messageVoteNotRegistered} />
            );
            toggleLoadingButtonYes(undefined);
        }
    };

    const handleStatus = (
        votesFor: number,
        votesAgainst: number,
        oldStatus:
            | 'canceled'
            | 'executed'
            | 'ready'
            | 'defeated'
            | 'expired'
            | 'active',
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
                    <Row pt={1}>
                        <Text g500 pb={0} pr={0} pt={0}>
                            <String id="createdBy" />:
                        </Text>
                        <Box style={{ padding: 0 }}>
                            <Text g500 p600 pl={1} pt={0}>
                                {proposals.proposer}
                            </Text>
                        </Box>
                    </Row>
                </Col>

                <Col colSize={{ sm: 4, xs: 12 }} right>
                    {voteRunning?.includes(proposals.status) && (
                        <Label
                            content={t('voteIsRunning')}
                            icon="clock"
                            system
                        />
                    )}

                    {proposals.status === 'defeated' && (
                        <Label
                            content={view.data.stringProposalDeclined}
                            error
                            icon="arrowDown"
                        />
                    )}

                    {proposals.status === 'ready' && (
                        <Label
                            content={view.data.stringProposalApproved}
                            icon="arrowUp"
                            success
                        />
                    )}

                    {proposals.status === 'executed' && (
                        <Label
                            content={view.data.stringProposalExecuted}
                            icon="arrowUp"
                            success
                        />
                    )}

                    {proposals.status === 'expired' && (
                        <Label
                            content={view.data.stringProposalExpired}
                            error
                            icon="arrowDown"
                        />
                    )}

                    {proposals.status === 'canceled' && (
                        <Label
                            content={view.data.stringProposalCanceled}
                            error
                            icon="arrowDown"
                        />
                    )}
                </Col>
            </Row>

            <Divider />

            <Row fLayout="center start" pb={1}>
                {!auth?.type?.includes('councilMember') &&
                    voteRunning?.includes(proposals.status) && (
                        <Col pb={0}>
                            <Label
                                content={
                                    <RichText
                                        content={
                                            view.data.messageNotAllowedVote
                                        }
                                    />
                                }
                                error
                                icon="sad"
                            />
                        </Col>
                    )}
                <CanBeRendered types={['councilMember']}>
                    {proposals.userVoted === -1 &&
                        proposals.status === 'active' && (
                            <Col pb={0} pr={0}>
                                <>
                                    <Button
                                        disabled={loadingButtonYes}
                                        error
                                        isLoading={loadingButtonYes === false}
                                        onClick={() =>
                                            voteFunction(proposals.id, 0)
                                        }
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
                            </Col>
                        )}

                    {proposals.status === 'ready' && (
                        <Col pb={0} pr={0}>
                            <Button
                                isLoading={loadingButtonExecute}
                                onClick={() => executeFunction(proposals.id)}
                            >
                                <RichText
                                    content={view.data.stringExecuteProposal}
                                />
                            </Button>
                        </Col>
                    )}
                </CanBeRendered>

                {proposals.status !== 'active' &&
                    proposals.status !== 'ready' && (
                        <Col pb={0} pr={0}>
                            <Label content={t('voteHasEnded')} />
                        </Col>
                    )}

                <Col flex maxW="100%" pb={0} pl={1} pt={1}>
                    {proposals.userVoted === 1 && (
                        <Row padding={1}>
                            <Col flex padding={0}>
                                <Text
                                    as="div"
                                    flex
                                    g800
                                    pl={0}
                                    pr={0.25}
                                    semibold
                                >
                                    <String id="you" /> +{' '}
                                    {handleVote(proposals.votesFor)}
                                </Text>
                                <Text g500 pr={0.25}>
                                    <String id="votedYes" />
                                </Text>
                                <Text pl={0.25} pr={0.5}>
                                    ·
                                </Text>
                            </Col>

                            <Col flex padding={0}>
                                <Text g800 pr={0} semibold>
                                    {proposals.votesAgainst}
                                </Text>
                                <Text g500 pl={0.25} pr={0}>
                                    <String id="votedNo" />
                                </Text>
                            </Col>
                        </Row>
                    )}

                    {proposals.userVoted === 0 && (
                        <Row padding={1}>
                            <Col flex padding={0}>
                                <Text g800 pr={0} semibold>
                                    {proposals.votesFor}
                                </Text>
                                <Text g500 pl={0.25} pr={0.25}>
                                    <String id="votedYes" />
                                </Text>
                                <Text pl={0.25} pr={0.5}>
                                    ·
                                </Text>
                            </Col>

                            <Col flex padding={0}>
                                <Text g800 pr={0} semibold>
                                    <String id="you" /> +{' '}
                                    {handleVote(proposals.votesAgainst)}
                                </Text>
                                <Text g500 pl={0.25} pr={0}>
                                    <String id="votedNo" />
                                </Text>
                            </Col>
                        </Row>
                    )}

                    {proposals.userVoted === -1 && (
                        <Row padding={1}>
                            <Col flex padding={0}>
                                <Text g800 pr={0} semibold>
                                    {proposals.votesFor}
                                </Text>
                                <Text g500 pl={0.25} pr={0.25}>
                                    <String id="votedYes" />
                                </Text>
                                <Text pl={0.25} pr={0.5}>
                                    ·
                                </Text>
                            </Col>

                            <Col flex padding={0}>
                                <Text g800 pr={0} semibold>
                                    {proposals.votesAgainst}
                                </Text>
                                <Text g500 pl={0.25} pr={0}>
                                    <String id="votedNo" />
                                </Text>
                            </Col>
                        </Row>
                    )}
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
