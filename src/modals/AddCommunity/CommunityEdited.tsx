import {
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

const CommunityEdited = () => {
    const { handleClose } = useModal();

    const { extractFromModals } = usePrismicData();
    const { content, title } = extractFromModals('communitySubmitted') as any;

    return (
        <ModalWrapper maxW={25} padding={1.5} w="100%">
            <CircledIcon icon="checkCircle" medium success />
            <Text g900 large medium mt={1.25}>
                {title}
            </Text>
            <RichText content={content} g500 mt={1.25} />
            <Button gray mt={2} onClick={handleClose} w="100%">
                <String id="continue" />
            </Button>
        </ModalWrapper>
    );
};

export default CommunityEdited;
