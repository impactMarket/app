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
                    <CircledIcon icon="alertCircle" large e600 />
                </Col>
            </Box>
            <Box mt="1.25rem">
                <RichText
                    content={modals.data.success_title}
                    large
                    g900
                    semibold
                />
            </Box>
            <Box mt="1.25rem">
                <RichText content={modals.data.success_content} medium g500 />
            </Box>
            <Button fluid gray xl onClick={() => closeModal()} mt="2rem">
                {`Continue`}
            </Button>
        </ModalWrapper>
    );
};

export default SuccessModal;
