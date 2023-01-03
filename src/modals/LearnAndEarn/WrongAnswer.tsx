import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    useModal
} from '@impact-market/ui';
import React from 'react';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import RichText from '../../libs/Prismic/components/RichText';

const WrongAnswer = () => {
    const { handleClose, onClose, attempts } = useModal();
    const { modals } = usePrismicData();

    const closeModal = () => {
        handleClose();
        onClose();
    };

    const attemptsNumber = attempts <= 3 ? (3 - attempts).toString() : '0';

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <Box fLayout="between" flex w="100%">
                <Col>
                    <CircledIcon icon="alertCircle" large e600 />
                </Col>
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.failed_title}
                    large
                    g900
                    semibold
                />
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.failed_content}
                    medium
                    g500
                    variables={{ attemptsNumber }}
                />
            </Box>
            <Button fluid gray xl onClick={() => closeModal()} mt="2rem">
                {`Continue`}
            </Button>
        </ModalWrapper>
    );
};

export default WrongAnswer;
