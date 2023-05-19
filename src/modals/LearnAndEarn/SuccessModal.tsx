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

const SuccessModal = () => {
    const { handleClose, onClose } = useModal();
    const { modals } = usePrismicData();
    const closeModal = () => {
        handleClose();
        onClose();
    };

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <Box fLayout="between" flex w="100%">
                <Col>
                    <CircledIcon icon="checkBold" large s700 />
                </Col>
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.laeSuccessLessonTitle}
                    large
                    g900
                    semibold
                />
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.laeSuccessLessonDescription}
                    medium
                    g500
                />
            </Box>
            <Button fluid gray xl onClick={() => closeModal()} mt="2rem">
                <String id="continue" />
            </Button>
        </ModalWrapper>
    );
};

export default SuccessModal;
