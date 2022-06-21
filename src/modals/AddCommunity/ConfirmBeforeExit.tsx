/* eslint-disable no-throw-literal */
import { Box, Button, CircledIcon, Col, ModalWrapper, Row, Text, useModal } from '@impact-market/ui';
// import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';

const ConfirmBeforeExitAddCommunity = () => {
    const { callback, handleClose } = useModal();
    
    // const { extractFromModals } = usePrismicData();
    // const { description, title } = extractFromModals('wrongNetwork') as any;

    const onSubmit = () => {
        callback();
        handleClose();
    }

    return (
        <ModalWrapper maxW={30} onCloseButton={handleClose} padding={1.5} w="100%">
            <Box column fLayout="start" flex>
                <CircledIcon error icon="alertCircle" large />
                <Text g900 large medium mt={1.25}>You have unsaved changes!</Text>
                <Text g500 mt={0.5} small>Do you want to save your changes so you can continue later?</Text>
            </Box>
            <Row mt={1}>
                <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                    <Button gray onClick={handleClose} w="100%">
                        Just exit
                    </Button>
                </Col>

                <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                    <Button onClick={onSubmit} w="100%">
                        Save and exit
                    </Button>
                </Col>
            </Row>
        </ModalWrapper>
    )
}

export default ConfirmBeforeExitAddCommunity;
