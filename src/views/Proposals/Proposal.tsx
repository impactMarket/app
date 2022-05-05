import {
    Box,
    Button,
    Card,
    Col,
    Divider,
    Label,
    Row,
    Text,
    ViewContainer
} from '@impact-market/ui';
import { useUBICommittee } from '@impact-market/utils/useUBICommittee';
import React from 'react'

interface proposalProps {
    data: any
}

const Proposal: React.FC<proposalProps> = ({ data }, props) => {
    const { isLoading } = props;
    const {
        id,
        proposer,
        signatures,
        endBlock,
        description,
        status,
        votesAgainst,
        votesFor,
        votesAbstain
    } = data;
    const { cancel, execute, vote, quorumVotes } = useUBICommittee();

        // <Box mt={1}>
        //     <div>
        //         <Text style={{whiteSpace: 'preWrap'}}>{id}</Text>
        //          <p>{id} | {proposer}: {description}</p>
        //         {
        //             p.status === 2 ? <p>canceled</p> :
        //                 p.status === 1 ? <p>executed</p> :
        //                     p.votesFor >= quorumVotes ? <><button onClick={() => execute(p.id)}>execute</button><button onClick={() => cancel(p.id)}>cancel</button></> :
        //                         p.votesAgainst >= quorumVotes ? <p>defeated</p> :
        //                             p.endBlock < blockNumber ? <p>expired</p> :
        //                                 <><button onClick={() => vote(p.id, 1)}>vote for</button><button onClick={() => vote(p.id, 0)}>vote against</button><button onClick={() => cancel(p.id)}>cancel</button></>
        //         } 
        //     </div>
        // </Box>

    return (       
            <Card mt={1}>
                <Text large semibold>
                    Proposal #{id}
                </Text>
                <Row pb={0.25} pt={0.5}>
                    <Col colSize={{ sm: 8 }}>
                        <Row>
                            <Text g500 pr={0}>
                                Created by: 
                            </Text>
                            <Text g500 p600 pl={0.5}>
                                {proposer}
                            </Text>    
                        </Row>
                    </Col>

                    <Col colSize={{ sm: 4 }} right>
                        {status === 0 &&
                            <Label content="Vote is running" icon="clock" system />
                        }

                        {status === 2 && 
                            <Label
                                content="Proposal Declined"
                                error
                                icon="arrowDown"
                            />
                        }

                        {status === 1 && 
                            <Label
                                content="Proposal Approved"
                                icon="arrowUp"
                                success
                            />
                        }
                    </Col>
                </Row>

                <Divider />
                <Row fLayout="center start">
                    <Col>
                    
                    <>
                        {/* <Label
                            content="You are not allowed to vote"
                            error
                            icon="sad"
                        /> */}

                        {votesFor < quorumVotes && votesAgainst < quorumVotes &&
                            <>
                                <Button error mr={0.5} onClick={() => vote(data.id, 0)}>
                                    Decline
                                </Button>
                                <Button onClick={() => vote(data.id, 1)} success>Accept</Button>
                            </>
                        }
                    </>
                    
                        {votesFor >= quorumVotes && 
                            <Button mr={1.938} onClick={() => execute(data.id)}>Execute Proposal</Button>
                        }

                        {status !== 0 && 
                            <Label content="Vote has ended" />
                        }
                    </Col>
                    <Col>
                        <Row>
                            {/* <Text g800 pr={0.25} semibold>
                                You +
                            </Text> */}
                            <Text g800 pl={0} pr={0} semibold>
                                {votesFor}
                            </Text>
                            <Text g500 pl={0.25} pr={0.5}>
                                Voted Yes
                            </Text>
                            <Text pl={0} pr={0}>
                                ·
                            </Text>
                            <Text g800 pl={0.5} pr={0} semibold>
                            {votesAgainst}
                            </Text>
                            <Text g500 pl={0.25}>
                                Voted No
                            </Text>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Text>
                        {description}
                    </Text>
                </Row>
            </Card>
    );
}

export default Proposal