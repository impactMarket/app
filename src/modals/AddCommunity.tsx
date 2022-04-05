import { Button, CircledIcon, Col, ModalWrapper, Row, Text, useModal } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React from 'react';

const AddCommunity = () => {
    const { handleClose, onSubmit, data, isSubmitting } = useModal();

    // TODO: load information from prismic and use it in the content
    // const { extractFromModals } = usePrismicData();
    // const { buttonLabel, content, items, title } = extractFromModals('communityRules') as any;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            { /* TODO: Fix icon size in UI (needs new option) */ }
            <CircledIcon icon="plusCircle" large success /> 
            <Text g900 large mt={1.25} semibold>
                Community Contract Parameters
            </Text>
            <Text g500 mt={0.5} small>
                Before submitting, please confirm the following parameters are correct.
            </Text>
            <Text g500 mt={1.25}>
                Each beneficiary will be able to claim $0.75 per day, up to $100 with a 5 minutes increment after each claim?
            </Text>
            <Row fLayout="between" margin={0} mt={1.25} w="100%">
                <Col colSize={6} pl={0} pr={0.375}>
                    <Button disabled={isSubmitting} fluid="md" gray onClick={handleClose} w="100%">
                        Go Back
                    </Button>
                </Col>
                <Col colSize={6} pl={0.375} pr={0}>
                    <Button fluid="md" isLoading={isSubmitting} onClick={() => { onSubmit(); handleClose(); }} w="100%">
                        I confirm
                    </Button>
                </Col>
            </Row>
        </ModalWrapper>
    )
}

export default AddCommunity;
