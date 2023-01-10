import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    useModal
} from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

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
                    content={modals.data.title_failed}
                    large
                    g900
                    semibold
                />
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.content_failed}
                    medium
                    g500
                    variables={{ attempts: attemptsNumber }}
                />
            </Box>
            <Button fluid gray xl onClick={() => closeModal()} mt="2rem">
                <String id="continue" />
            </Button>
        </ModalWrapper>
    );
};

export default WrongAnswer;
