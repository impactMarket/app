import { Avatar, Box, Card, CircledIcon, Col, Display, Divider, Row, Text, TextLink } from '@impact-market/ui';
import { PutPostUser } from '../../api/user';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName } from '../../utils/users';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import TooltipIcon from '../../components/TooltipIcon';


type Cards = {
    number: number;
    title: string;
    tooltip: boolean;
    tooltipContent: any;
    url: string;
    tooltipVariables: any;
}

const renderCard = (card: Cards, index: number, type: number) => {
    const titleProps = type === 1 ? { g900: true, medium: true } : { g500: true, medium: true, small: true };
    const numberProps = type === 1 ? { g900: true, large: true, mt: 1.5, semibold: true } : { g900: true, mt: 0.5, semibold: true, small: true };
    const colProps = type === 1 ? { lg: 4, md: 3, sm: 6, xs: 12 } : { md: 3, sm: 6, xs: 12 };

    return (
        <Col colSize={{ ...colProps }} key={index}>
            <Card column fLayout="start between" flex h="100%" pl={0} pr={0} pt={1.5}>
                <Box pl={1.5} pr={1.5} w="100%">
                    <Text {...titleProps} flex>
                        {card.title}
                        {card?.tooltip && <TooltipIcon variables={card?.tooltipVariables}>{card?.tooltipContent}</TooltipIcon>}
                    </Text>
                    <Display {...numberProps}>
                        {card.number}
                    </Display>
                </Box>
                <Box w="100%">
                    <Divider />
                    <Box fLayout="end" flex pl={1.5} pr={1.5}>
                        <TextLink href={card.url} medium p700 small><String id="viewAll" /></TextLink>
                    </Box>
                </Box>
            </Card>
        </Col>
    );
};

const Manager: React.FC<{ communityAmbassador: PutPostUser, primaryCards: Cards[], secondaryCards: Cards[] }> = props => {
    const { communityAmbassador, primaryCards, secondaryCards } = props;

    return (
        <>
            <Row colSpan={1.5} margin={0} mt={2} w="100%">
                {
                    primaryCards?.length > 0 && primaryCards.map((card: any, index: number) => renderCard(card, index, 1))
                }
                <Col colSize={{ lg: 4, md: 6, sm: 12, xs: 12 }}>
                    <Card column fLayout="start between" flex h="100%" pl={0} pr={0} pt={1.5}>
                        <Box pl={1.5} pr={1.5} w="100%">
                            <Text g900 medium>
                                <String id="communityAmbassador" />
                            </Text>
                        </Box>
                        <Box fLayout="center start" flex mt={1.5} pl={1.5} pr={1.5}>
                            <Box mr={1.5}>
                                {
                                    !communityAmbassador?.avatarMediaPath ?
                                    <CircledIcon icon="user" superlarge />
                                    :
                                    <Avatar medium url={getImage({ filePath: communityAmbassador?.avatarMediaPath, fit: 'cover', height: 85, width: 85 })} />
                                }
                            </Box>
                            <Box column flex>
                                {
                                    (communityAmbassador?.firstName || communityAmbassador?.lastName) &&
                                    <Text g700 semibold>
                                        {getUserName(communityAmbassador)}
                                    </Text>
                                }
                                <Text g700 small>
                                    {formatAddress(communityAmbassador?.address, [6, 4])}
                                </Text>
                                {
                                    communityAmbassador?.email &&
                                    <Text medium mt={1} p600 small>
                                        {communityAmbassador.email}
                                    </Text>
                                }
                            </Box>
                        </Box>
                        <Box w="100%">
                            <Divider />
                            <Box fLayout="end" flex pl={1.5} pr={1.5}>
                                { /* TODO: add destination url */ }
                                { /* TODO: remove temporary "disabled" once we have a destination URL */ }
                                <TextLink disabled href="#" medium p700 small><String id="sendMessage" /></TextLink>
                            </Box>
                        </Box>
                    </Card>
                </Col>
            </Row>
            {
                secondaryCards?.length > 0 &&
                <Row colSpan={1.5} margin={0} mt={1.5} w="100%">
                    {
                        secondaryCards.map((card: any, index: number) => renderCard(card, index, 2))
                    }
                </Row>
            }
        </>
    );
};

export default Manager;
