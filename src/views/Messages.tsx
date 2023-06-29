import {
    Box,
    Button,
    Col,
    Display,
    Divider,
    Dot,
    Icon,
    Input,
    Label,
    Row,
    Text,
    Typing,
    ViewContainer
} from '@impact-market/ui';
import React from 'react';

const Messages: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <Row h="100%">
                <Col bgColor="g25" colSize={{ sm: 5, xs: 12 }} pb={0} pt={0}>
                    <Box fLayout="center between" flex>
                        <Box fLayout="center start" flex>
                            <Display>Messages</Display>
                            <Label content="3" margin={1} />
                        </Box>
                        <Box>
                            <Button gray icon="open" />
                        </Box>
                    </Box>
                    <Input
                        icon="search"
                        placeholder="Search"
                        wrapperProps={{ mt: 1.2 }}
                    />

                    <Divider />

                    {/* Message card new message */}
                    <Box>
                        <Box fLayout="center between" flex>
                            <Box fLayout="center start" flex>
                                <Dot mr={0.75} />
                                <Text pr={1}>FOTO</Text>

                                <Box>
                                    <Text medium>Primeiro e ultimo nome</Text>

                                    <Text>Address</Text>
                                </Box>
                            </Box>

                            <Text>20min ago</Text>
                        </Box>

                        <Text pl={1} pt={1}>
                            Exemplo mensagem
                        </Text>

                        <Divider />
                    </Box>

                    {/* Message card */}
                    <Box>
                        <Box fLayout="center between" flex>
                            <Box fLayout="center start" flex>
                                <Text pr={1}>FOTO</Text>

                                <Box>
                                    <Text medium>Primeiro e ultimo nome</Text>

                                    <Text>Address</Text>
                                </Box>
                            </Box>

                            <Text>20min ago</Text>
                        </Box>

                        <Text pl={1} pt={1}>
                            Exemplo mensagem
                        </Text>

                        <Divider />
                    </Box>
                </Col>
                <Col colSize={{ sm: 7, xs: 12 }} pb={0} pt={0}>
                    <Box column fLayout="between" flex h="100vh">
                        <Box>
                            {/* Person information header */}
                            <Box fLayout="around between" flex>
                                <Box fLayout="center start" flex>
                                    <Text pr={1}>FOTO</Text>

                                    <Box>
                                        <Box flex>
                                            <Text medium>
                                                Primeiro e ultimo nome
                                            </Text>

                                            <Label
                                                content="online"
                                                margin={0}
                                                success
                                            />
                                        </Box>

                                        <Text>Address</Text>
                                    </Box>
                                </Box>
                                <Button secondary>View profile</Button>
                            </Box>

                            <Divider />

                            {/* Day Divider */}
                            <Divider margin="2 0" text="Thursday" />

                            {/* Other person messages */}
                            <Box fLayout="start" flex pb={1} w="100%">
                                <Text pr={1}>Avatar</Text>

                                <Box fLayout="start" flex w="100%">
                                    <Box maxW="70%" minW="60%">
                                        <Box fLayout="center between" flex>
                                            <Text medium>Katherine Moss</Text>

                                            <Text>Thursday 10:16am</Text>
                                        </Box>

                                        <Box
                                            bBottomLeftRadius={0.5}
                                            bBottomRightRadius={0.5}
                                            bTopRightRadius={0.5}
                                            bgColor="g200"
                                            w="100%"
                                        >
                                            <Text
                                                pb={0.625}
                                                pl={0.875}
                                                pr={0.875}
                                                pt={0.625}
                                            >
                                                Hello
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {/* My messages */}
                            <Box fLayout="end" flex pb={1} w="100%">
                                <Box maxW="70%" minW="40%">
                                    <Box fLayout="center between" flex>
                                        <Text medium>You</Text>

                                        <Text>Thursday 10:16am</Text>
                                    </Box>

                                    <Box
                                        bBottomLeftRadius={0.5}
                                        bBottomRightRadius={0.5}
                                        bTopLeftRadius={0.5}
                                        bgColor="p500"
                                        w="100%"
                                    >
                                        <Text
                                            pb={0.625}
                                            pl={0.875}
                                            pr={0.875}
                                            pt={0.625}
                                            sColor="g25"
                                        >
                                            Hello
                                        </Text>
                                    </Box>
                                    <Box fLayout="end" flex pt={0.625}>
                                        <Icon e600 icon="heartFilled" />
                                    </Box>
                                </Box>
                            </Box>

                            {/* Other person typing animation */}
                            <Box fLayout="start" flex pb={1} w="100%">
                                <Text pr={1}>Avatar</Text>

                                <Box fLayout="start" flex w="10%">
                                    <Box>
                                        <Box fLayout="center between" flex>
                                            <Text medium>Katherine Moss</Text>
                                        </Box>

                                        <Box
                                            bBottomLeftRadius={0.5}
                                            bBottomRightRadius={0.5}
                                            bTopRightRadius={0.5}
                                            bgColor="g200"
                                            w="100%"
                                        >
                                            <Text
                                                pb={0.625}
                                                pl={0.875}
                                                pr={0.875}
                                                pt={1}
                                            >
                                                <Typing />
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <Box>
                            <Input
                                button={
                                    <Button onClick={function noRefCheck() {}}>
                                        Send
                                    </Button>
                                }
                                rows={3}
                                wrapperProps={{ mt: 2 }}
                            />
                        </Box>
                    </Box>
                </Col>
            </Row>
        </ViewContainer>
    );
};

export default Messages;
