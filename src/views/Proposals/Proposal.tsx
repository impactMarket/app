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
    p: any
}

const Proposal: React.FC<proposalProps> = ({ p }, props) => {
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
    } = p;
    const { cancel, execute, getProposals, vote, quorumVotes } = useUBICommittee();

    console.log(id);

    return (
<Box mt={1}>
        <div>
            <Text style={{whiteSpace: 'preWrap'}}>{id}</Text>

            {/* <p>{id} | {proposer}: {description}</p>
            {
                 p.status === 2 ? <p>canceled</p> :
                    p.status === 1 ? <p>executed</p> :
                         p.votesFor >= quorumVotes ? <><button onClick={() => execute(p.id)}>execute</button><button onClick={() => cancel(p.id)}>cancel</button></> :
                             p.votesAgainst >= quorumVotes ? <p>defeated</p> :
                                 p.endBlock < blockNumber ? <p>expired</p> :
                                    <><button onClick={() => vote(p.id, 1)}>vote for</button><button onClick={() => vote(p.id, 0)}>vote against</button><button onClick={() => cancel(p.id)}>cancel</button></>
            } */}
        </div>
        </Box>
        
        // <ViewContainer isLoading={isLoading}>
        //     <Card mt={1.5}>
        //         <Text large semibold>
        //             Proposal #1
        //         </Text>
        //         <Row pb={0.25} pt={0.5}>
        //             <Col colSize={{ sm: 8 }}>
        //                 <Row>
        //                     <Text g500 pr={0}>
        //                         Created by:
        //                     </Text>
        //                     <Text g500 p600 pl={0.5}>
        //                         0xDB5840CCf69e8b33632850F86eC45Ee9Ae220A85
        //                     </Text>
        //                 </Row>
        //             </Col>

        //             <Col colSize={{ sm: 4 }} right>
        //                 <Label content="Vote is running" icon="clock" system />

        //                 <Label
        //                     content="Proposal Declined"
        //                     error
        //                     icon="arrowDown"
        //                 />

        //                 <Label
        //                     content="Proposal Approved"
        //                     icon="arrowUp"
        //                     success
        //                 />
        //             </Col>
        //         </Row>

        //         <Divider />
        //         <Row fLayout="center start">
        //             <Col>
        //                 <Label
        //                     content="You are not allowed to vote"
        //                     error
        //                     icon="sad"
        //                 />

        //                 <Button error mr={0.5}>
        //                     Decline
        //                 </Button>
        //                 <Button success>Accept</Button>

        //                 <Button mr={1.938}>Execute Proposal</Button>

        //                 <Label content="Vote has ended" />
        //             </Col>
        //             <Col>
        //                 <Row>
        //                     <Text g800 pr={0.25} semibold>
        //                         You +
        //                     </Text>
        //                     <Text g800 pl={0} pr={0} semibold>
        //                         3
        //                     </Text>
        //                     <Text g500 pl={0.25} pr={0.5}>
        //                         Voted Yes
        //                     </Text>
        //                     <Text pl={0} pr={0}>
        //                         ·
        //                     </Text>
        //                     <Text g800 pl={0.5} pr={0} semibold>
        //                         1
        //                     </Text>
        //                     <Text g500 pl={0.25}>
        //                         Voted No
        //                     </Text>
        //                 </Row>
        //             </Col>
        //         </Row>
        //         <Row>
        //             <Text>
        //                 At vero eos et accusamus et iusto odio dignissimos
        //                 ducimus qui blanditiis praesentium voluptatum deleniti
        //                 atque corrupti quos dolores et quas molestias excepturi
        //                 sint occaecati cupiditate non provident, similique sunt
        //                 in culpa qui officia deserunt mollitia animi, id est
        //                 laborum et dolorum fuga.
        //             </Text>
        //         </Row>

        //         <Row>
        //             <Text p600>View more...</Text>
        //         </Row>
        //     </Card>
        // </ViewContainer>
    );
}

export default Proposal