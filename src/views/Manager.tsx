/* eslint-disable react-hooks/rules-of-hooks */
import { Accordion, AccordionItem, Avatar, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer, colors } from '@impact-market/ui';
import { currencyFormat } from '../utils/currency';
import { formatAddress } from '../utils/formatAddress';
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../utils/userTypes';
import Image from '../libs/Prismic/components/Image';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

const mainCards = [
    {
        number: 678,
        title: 'Total Beneficiaries',
        url: '/beneficiaries'
    },
    {
        number: 3,
        title: 'Total Managers',
        url: '/managers'
    }
];

const minorCards = [
    {
        number: 4,
        title: 'Suspicious Activity',
        url: '/beneficiaries'
    },
    {
        number: 23,
        title: 'Blocked',
        url: '/beneficiaries'
    },
    {
        number: 1678,
        title: 'Active',
        url: '/beneficiaries'
    },
    {
        number: 23,
        title: 'Inactive',
        url: '/beneficiaries'
    }
];

const Manager: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    
    // TODO: load information from prismic and use it in the content
    // const { view } = usePrismicData();

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();

    // TODO: Uncomment this code
    // Check if current User has access to this page
    // if(!auth?.user?.type?.includes(userManager)) {
    //     router.push('/');

    //     return null;
    // }

    const renderMainCard = (card: any, index: number) => {
        return (
            <Col colSize={{ md: 4, xs: 12 }}>
                <Card key={index}>
                    <Row fDirection="column" fLayout="start between" /* minH={type === 1 ? 15.375 : 10.438} */>
                        <Col w="100%">
                            <Text g900 medium>
                                {card.title}
                            </Text>
                            <Text extralarge g900 mt={1.5} semibold>
                                {card.number}
                            </Text>
                        </Col>
                        <Col w="100%">
                            <Box>
                                <Row right style={{ borderTop: `1px solid ${colors.g200}` }}>
                                    <Col colSize={12}>
                                        <Text onClick={() => router.push(card.url)} p700 style={{ cursor: 'pointer' }}>
                                            View All
                                        </Text>
                                    </Col>
                                </Row>
                            </Box>
                        </Col>
                    </Row>
                </Card>
            </Col>
        );
    }

    const renderMinorCard = (card: any, index: number) => {
        return (
            <Col colSize={{ md: 3, sm: 6, xs: 12 }}>
                <Card key={index}>
                    <Row fDirection="column" fLayout="start between" /* minH={type === 1 ? 15.375 : 10.438} */>
                        <Col w="100%">
                            <Text g900 medium>
                                {card.title}
                            </Text>
                            <Text extralarge g900 mt={0.5} semibold>
                                {card.number}
                            </Text>
                        </Col>
                        <Col w="100%">
                            <Box>
                                <Row right style={{ borderTop: `1px solid ${colors.g200}` }}>
                                    <Col colSize={12}>
                                        <Text onClick={() => router.push(card.url)} p700 style={{ cursor: 'pointer' }}>
                                            View All
                                        </Text>
                                    </Col>
                                </Row>
                            </Box>
                        </Col>
                    </Row>
                </Card>
            </Col>
        );
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <Display medium>
                Dashboard
            </Display>
            <Text g500 mt={0.25}>
                You are a manager and beneficiary of Ampain Refugee Camp - RIO.
            </Text>
            <Row colSpan={1.5} mt={2}>
                {
                    mainCards.map((card: any, index: number) => renderMainCard(card, index))
                }
                <Col colSize={{ md: 4, xs: 12 }}>
                    <Card>
                        <Text g900 medium>
                            Community Ambassador
                        </Text>
                        <Box mt={2}>
                            <Row>
                                <Col colSize={4}>
                                    <Avatar h={5.313} url="https://picsum.photos/120" w={5.313} />
                                </Col>
                                <Col colSize={8}>
                                    <Text g700 semibold>
                                        Olivia Rhye
                                    </Text>
                                    <Text g700>
                                        {formatAddress('0xF96B66f7Ca9a51647A30644d5A245901ad5eeD48', [6, 4])}
                                    </Text>
                                    <Text g900 mt={1} small>
                                        olivia@impactmarket.com
                                    </Text>
                                </Col>
                            </Row>
                        </Box>
                        <Box mt={2}>
                            <Row right style={{ borderTop: `1px solid ${colors.g200}` }}>
                                <Col colSize={12}>
                                    <Text p700 style={{ cursor: 'pointer' }}>
                                        Send Message
                                    </Text>
                                </Col>
                            </Row>
                        </Box>
                    </Card>
                </Col>
            </Row>
            <Row colSpan={1.5} mt={0.75}>
                {
                    minorCards.map((card: any, index: number) => renderMinorCard(card, index))
                }
            </Row>
            <Card mt={1.5}>
                <Row fLayout="center between">
                    <Col>
                        <Text g900 semibold>
                            $1,324 raised from 27 Donors
                        </Text>
                    </Col>
                    <Col>
                        <Text g500 small>
                            Goal: $518,800
                        </Text>
                    </Col>
                </Row>
                <ProgressBar mt={0.5} progress={60}/>
                <Row fLayout="center between" mt={1.5}>
                    <Col>
                        <Text g900 semibold>
                            Claimable funds ($23)
                        </Text>
                    </Col>
                    <Col>
                        { /* TODO: Add Label component in UI */ }
                        <Text small w700>
                            Low on funds
                        </Text>
                    </Col>
                </Row>
                { /* TODO: Progress bar needs new option to define color in UI */ }
                <ProgressBar mt={0.5} progress={7}/>
            </Card>
        </ViewContainer>
    );
};

export default Manager;
