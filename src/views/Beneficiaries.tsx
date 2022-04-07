/* eslint-disable react-hooks/rules-of-hooks */
import { Accordion, AccordionItem, Avatar, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer, colors, openModal } from '@impact-market/ui';
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

// TODO: remove after implementing request to get beneficiares
const hasUsers = false;

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

    return (
        <ViewContainer isLoading={isLoading}>
            <Row fDirection="column" fLayout="start between" h="60vh" w="100%">
                <Col colSize={12}>
                    <Row fLayout="start">
                        <Col colSize={hasUsers ? 6 : 12}>
                            <Display medium>
                                Beneficiaries
                            </Display>
                            <Text g500 mt={0.25} >
                                Manage community beneficiaries.
                            </Text>
                        </Col>
                        {
                            hasUsers &&
                            <Col colSize={6} right>
                                { /* TODO: Replace by correct icon */ }
                                <Button icon="plusCircle" onClick={() => openModal('addBeneficiary')}>
                                    Add Beneficiary
                                </Button>
                            </Col>
                        }
                    </Row>
                </Col>
                {
                    !hasUsers &&
                    <Col center colSize={12}>
                        { /* TODO: Fix icon size in UI (needs new option) AND replace by correct icon */ }
                        <CircledIcon icon="userMinus" info large /> 
                        <Text g900 medium mt={1}>
                            No beneficiaries found.
                        </Text>
                        <Text g500 mt={0.25} small>
                            This community hasn`t yet onboarded any beneficiary.
                        </Text>
                        <Button icon="plusCircle" mt={1.5} onClick={() => openModal('addBeneficiary')}>
                            Add Beneficiary
                        </Button>
                    </Col>
                }
            </Row>
        </ViewContainer>
    );
};

export default Manager;
