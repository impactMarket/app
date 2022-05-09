/* eslint-disable no-nested-ternary */
import {
    Box,
    Button,
    Card,
    Col,
    Divider,
    Label,
    Row,
    Text,
} from '@impact-market/ui';
import { useContractKit } from '@celo-tools/use-contractkit';
import { useUBICommittee } from '@impact-market/utils';
import React, { useState } from 'react'

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
        votedBy,
        votesAbstain,
        userHasVoted,
    } = data;
    const { cancel, execute, proposalCount, vote, quorumVotes } = useUBICommittee();
    const objDescription = description ? JSON.parse(description) : {};
    const { address } = useContractKit();

    const [blockNumber, setBlockNumber] = useState(0);

    const usersVote = () => {

        if(votedBy.includes(address)){
            return true;
        } 

            return false;
        ;
    }

    // <Box mt={1}>
    //     <div>
    //         <Text style={{whiteSpace: 'preWrap'}}>{id}</Text>
    //          <p>{id} | {proposer}: {description}</p>
    //         {
    //             status === 2 ? <p>canceled</p> :
    //                 status === 1 ? <p>executed</p> :
    //                     votesFor >= quorumVotes ? <><button onClick={() => execute(id)}>execute</button><button onClick={() => cancel(id)}>cancel</button></> :
    //                         votesAgainst >= quorumVotes ? <p>defeated</p> :
    //                             endBlock < blockNumber ? <p>expired</p> :
    //                                 <><button onClick={() => vote(id, 1)}>vote for</button><button onClick={() => vote(id, 0)}>vote against</button><button onClick={() => cancel(id)}>cancel</button></>
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
                    <Col pl={0}>
                    <>
                        {/* <Label
                            content="You are not allowed to vote"
                            error
                            icon="sad"
                        /> */}

                        {votesFor < quorumVotes && votesAgainst < quorumVotes && !usersVote  &&
                            <>
                                <Button  error ml={1} mr={0.5} onClick={() => vote(data.id, 0)}>
                                    Decline
                                </Button>
                                <Button  ml={1} onClick={() => vote(data.id, 1)} success>Accept</Button>
                            </>
                        }
                    </>
                    
                        {votesFor >= quorumVotes && status !== 1 &&
                            <Button  ml={1} mr={1.938} onClick={() => execute(data.id)}>Execute Proposal</Button>
                        }

                        {status !== 0 && 
                            <Label content="Vote has ended" ml={1} />
                        }
                    </Col>
                    <Col pl={0}>
                        <Row>
                            <Box flex pr={0.25}>
                                {/* <Text g800  semibold>
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
                            </Box>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Box>
                        <Text mb={1}>
                        {objDescription.title}
                        </Text>
                        <Text>
                            {objDescription.description}
                        </Text>
                    </Box>
                </Row>
            </Card>
    );
}

export default Proposal