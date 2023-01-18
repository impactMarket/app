import {
    Box,
    Card,
    CircledIcon,
    Col,
    Icon,
    Row,
    Text,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Alerts from './Alerts'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';

const Home: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { view } = usePrismicData();
    const { user } = useSelector(selectCurrentUser);
    const userRoles = user?.roles
   
    const [cards, setCards] = useState() as any[]
    const [links, setLinks] = useState() as any[]
    const prismic = view?.data

    // Get all cards/links
    useEffect(() => {
        // Get each card/link for the user's role
        const rolesCards = userRoles?.map((user: string) => prismic[`cards${user.charAt(0).toUpperCase() + user.slice(1)}`])
        const rolesLinks = userRoles?.map((user: string) => prismic[`links${user.charAt(0).toUpperCase() + user.slice(1)}`])

        const mergedCards: any[] = []
        const mergedLinks: any[] = []

        // Merge all cards/links in one array
        rolesCards?.map((arr: any[]) => arr?.map((obj: any) => mergedCards.push(obj)))
        rolesLinks?.map((arr: any[]) => arr?.map((obj: any) => mergedLinks.push(obj)))

        // If user is connected show the respective cards/links, if not show cardsDefault/linksDefault prismic tab
        if (user && (cards?.length !== 0 || links?.length !== 0)) {
            // Remove duplicates (has the same title and url)
            setCards(mergedCards.filter((obj, index) => {
                return index === mergedCards.findIndex(o => obj.title === o.title && obj.url === o.url);
            }))
            setLinks(mergedLinks.filter((obj, index) => {
                return index === mergedLinks.findIndex(o => obj.title === o.title && obj.url === o.url);
            }))
        } else {
            setCards(prismic['cardsDefault'])
            setLinks(prismic['linksDefault'])
        }
    }, [])

    return (
        <ViewContainer isLoading={isLoading}>
            <Row>
                <Alerts/>
                {cards?.map((card: any, key: React.Key) => (
                    card.isActive && card.title && card.url && (
                        <Col colSize={{ sm: card.size ? 12 : 6, xs: 12}}>
                            <Link href={card.url ||'/'} passHref key={key}>
                                <Card as="a" flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                                    <Box inlineFlex style={{ alignItems: "center", gap: "1rem" }}>
                                        <CircledIcon icon={card.icon} large /> 
                                        <Box>
                                            <Text g800 small semibold>
                                                {card.title}
                                            </Text>
                                            <RichText
                                                small
                                                g500
                                                content={card.description}
                                            />
                                        </Box>
                                    </Box>
                                    <Icon
                                        icon="arrowRight"
                                        g400
                                    />
                                </Card>
                            </Link>
                        </Col>
                    )
                ))}
                {(!!links?.length) && (
                    <Box w="100%">
                        <Card flex fDirection="column" style={{ gap: "1rem" }}>
                            {links?.map((link: any, key: React.Key) => (
                                <Link href={link.url || '/'} passHref key={key}>
                                    <Box as="a" flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                                        <Box inlineFlex style={{ alignItems: "center", gap: "1rem" }}>
                                            <CircledIcon icon={link.icon} bgColor="#2E6AFF" sColor="#F3F6FF" small/> 
                                            <Text g800 small semibold>
                                                {link.title}
                                            </Text>
                                        </Box>
                                        <Icon
                                            icon="arrowRight"
                                            g400
                                        />
                                    </Box>   
                                </Link>
                            ))}
                        </Card>
                    </Box>
                )}
            </Row>
        </ViewContainer>
    );
};

export default Home;
