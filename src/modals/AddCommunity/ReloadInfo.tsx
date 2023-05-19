import {
    Box,
    Button,
    CircledIcon,
    ModalWrapper,
    Text,
    useModal
} from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

const ReloadInfo = () => {
    const { handleClose, reloadInfo } = useModal();

    const { extractFromModals } = usePrismicData();
    const { content, title } = extractFromModals(
        'reloadInfoAddCommunity'
    ) as any;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <CircledIcon icon="alertCircle" medium warning />
            <Text g900 large mt={1.25} semibold>
                {title}
            </Text>
            <RichText content={content} g500 mt={0.5} small />
            <Box flex mt={2}>
                <Box pr={0.375} w="50%">
                    <Button gray onClick={handleClose} w="100%">
                        <String id="cancel" />
                    </Button>
                </Box>
                <Box pl={0.375} w="50%">
                    <Button
                        onClick={() => {
                            reloadInfo();
                            handleClose();
                        }}
                        w="100%"
                    >
                        <String id="loadSession" />
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default ReloadInfo;
