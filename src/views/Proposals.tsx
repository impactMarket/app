import {
    Button,
    Card,
    Col,
    Display,
    Divider,
    Label,
    Row,
    Text,
    ViewContainer
} from '@impact-market/ui';
import React from 'react';

const cases = [
    { id: 1, value: '1' },
    { id: 2, value: '2' },
    { id: 3, value: '3' },
    { id: 4, value: '4' },
    { id: 5, value: '5' },
    { id: 6, value: '1' },
    { id: 7, value: '2' },
    { id: 8, value: '3' },
    { id: 9, value: '4' },
    { id: 10, value: '5' }
];

const Proposals: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>Proposals</Display>
            <Text g500>
                Authorized $PACT holders can vote on proposals to accept or
                decline communities.
            </Text>

            {cases.map((id) => (
                <Card key={id} mt={1.5}>
                    <Text large semibold>
                        Proposal #1
                    </Text>
                    <Row pb={0.25} pt={0.5}>
                        <Col colSize={{ sm: 8 }}>
                            <Row>
                                <Text g500 pr={0}>
                                    Created by:
                                </Text>
                                <Text g500 p600 pl={0.5}>
                                    0xDB5840CCf69e8b33632850F86eC45Ee9Ae220A85
                                </Text>
                            </Row>
                        </Col>

                        <Col colSize={{ sm: 4 }} right>
                            <Label
                                content="Vote is running"
                                icon="clock"
                                system
                            />

                            <Label
                                content="Proposal Declined"
                                error
                                icon="arrowDown"
                            />

                            <Label
                                content="Proposal Approved"
                                icon="arrowUp"
                                success
                            />
                        </Col>
                    </Row>

                    <Divider />
                    <Row fLayout="center start">
                        <Col>
                            <Label
                                content="You are not allowed to vote"
                                error
                                icon="sad"
                            />

                            <Button error mr={0.5}>
                                Decline
                            </Button>
                            <Button success>Accept</Button>

                            <Button mr={1.938}>Execute Proposal</Button>

                            <Label content="Vote has ended" />
                        </Col>
                        <Col>
                            <Row>
                                <Text g800 pr={0.25} semibold>
                                    You +
                                </Text>
                                <Text g800 pl={0} pr={0} semibold>
                                    3
                                </Text>
                                <Text g500 pl={0.25} pr={0.5}>
                                    Voted Yes
                                </Text>
                                <Text pl={0} pr={0}>
                                    ·
                                </Text>
                                <Text g800 pl={0.5} pr={0} semibold>
                                    1
                                </Text>
                                <Text g500 pl={0.25}>
                                    Voted No
                                </Text>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Text>
                            At vero eos et accusamus et iusto odio dignissimos
                            ducimus qui blanditiis praesentium voluptatum
                            deleniti atque corrupti quos dolores et quas
                            molestias excepturi sint occaecati cupiditate non
                            provident, similique sunt in culpa qui officia
                            deserunt mollitia animi, id est laborum et dolorum
                            fuga.
                        </Text>
                    </Row>

                    <Row>
                        <Text p600>View more...</Text>
                    </Row>
                </Card>
            ))}
        </ViewContainer>
    );
};

export default Proposals;
