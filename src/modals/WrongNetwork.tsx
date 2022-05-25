import { Box, CircledIcon, ModalWrapper, Text, useModal } from '@impact-market/ui';
// import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React, { useEffect } from 'react';
import useWallet from '../hooks/useWallet';

const WrongNetwork = () => {
    const { handleClose } = useModal();
    const { wrongNetwork } = useWallet();
    // const { extractFromModals } = usePrismicData();

    useEffect(() => {   
        if(!wrongNetwork) {
            handleClose();
        }
    }, [wrongNetwork]);

    // TODO: load real info from Prismic
    // const { buttonLabel, content, title } = extractFromModals('welcomeBeneficiary') as any;

    // TODO: missing design for this

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <Box column fLayout="center" flex>
                <CircledIcon icon="sad" large />
                <Text mt={1}>You`re in the wrong network!</Text>
            </Box>
        </ModalWrapper>
    )
}

export default WrongNetwork;
