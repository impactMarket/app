import { Box, CircledIcon, ModalWrapper, Text, useModal } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React, { useEffect } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import useWallet from '../hooks/useWallet';

const WrongNetwork = () => {
    const { handleClose } = useModal();
    const { wrongNetwork } = useWallet();
    
    const { extractFromModals } = usePrismicData();
    const { description, title } = extractFromModals('wrongNetwork') as any;

    useEffect(() => {   
        if(!wrongNetwork) {
            handleClose();
        }
    }, [wrongNetwork]);

    return (
        <ModalWrapper maxW={30} padding={1.5} w="100%">
            <Box column fLayout="start" flex>
                <CircledIcon error icon="alertCircle" large />
                <Text g900 large medium mt={1.25}>{title}</Text>
                <RichText content={description} g500 mt={0.5} small />
            </Box>
        </ModalWrapper>
    )
}

export default WrongNetwork;
