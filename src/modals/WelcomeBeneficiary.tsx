import { Avatar, Box, Button, ModalWrapper, openModal, useModal } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';

const Welcome = () => {
    const { acceptCommunityRules, communityName, communityImage } = useModal();
    const { extractFromModals } = usePrismicData();

    const { buttonLabel, content, title } = extractFromModals('welcomeBeneficiary') as any;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            {
                communityImage &&
                <Avatar large margin="auto" mb={1.5} url={communityImage} />
            }
            <RichText center content={title} large medium variables={{ community: communityName }} />
            <RichText base center content={content} g500 mt={0.5} />
            <Box mt={1.5} w="100%">
                <Button fluid="xs" onClick={() => openModal('communityRules', { acceptCommunityRules, communityName })}>
                    {buttonLabel}
                </Button>
            </Box>
        </ModalWrapper>
    )
}

export default Welcome;
