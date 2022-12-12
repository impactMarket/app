import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Text,
    useModal
} from '@impact-market/ui';
import React from 'react';

const SuccessModal = () => {
    const { handleClose, onClose } = useModal();
    const closeModal = () => {
        handleClose();
        onClose();
    };

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <Box fLayout="between" flex w="100%">
                <Col>
                    <CircledIcon icon="alertCircle" large e600 />
                </Col>
            </Box>
            <Box mt="1.25rem">
                <Text large g900 semibold>
                    {'Congrats you have completed the lesson.'}
                </Text>
            </Box>
            <Button fluid gray xl onClick={() => closeModal()} mt="2rem">
                {`Continue`}
            </Button>
        </ModalWrapper>
    );
};

export default SuccessModal;
