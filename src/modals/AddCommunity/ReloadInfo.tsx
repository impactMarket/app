/* eslint-disable no-nested-ternary */
import { Box, Button, CircledIcon, ModalWrapper, Text, useModal } from '@impact-market/ui';
// import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import String from '../../libs/Prismic/components/String';

const ReloadInfo = () => {
    const { handleClose, reloadInfo } = useModal();

    // TODO: load info from the correct Modal and use it
    // const { extractFromModals } = usePrismicData();
    // const { beneficiaryAble, content, title } = extractFromModals('createAddCommunity') as any;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <CircledIcon icon="alertCircle" medium warning /> 
            <Text g900 large mt={1.25} semibold>Attention!</Text>
            <Text g500 mt={0.5} small>You have a pre-recorded Community information that was not completed! Do you wish to load it?</Text>
            <Box flex mt={2}>
                <Box pr={0.375} w="50%">
                    <Button gray onClick={handleClose} w="100%">
                        <String id="cancel" />
                    </Button>
                </Box>
                <Box pl={0.375} w="50%">
                    <Button onClick={() => { reloadInfo(); handleClose(); }} w="100%">
                        <String id="confirm" />
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    )
}

export default ReloadInfo;
