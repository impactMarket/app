import { Box, Button, Col, Display, ModalWrapper, Row, Text, useModal } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import Image from '../libs/Prismic/components/Image';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';

const Rules = () => {
    const { handleClose, acceptCommunityRules, communityName } = useModal();
    const { extractFromModals } = usePrismicData();

    const { buttonLabel, content, items, title } = extractFromModals('communityRules') as any;

    return (
        <ModalWrapper maxW={78.25} padding={1.5} w="100%">
            <Display medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.5} small variables={{ community: communityName }}/>
            <Box mt={2}>
                <Row colSpan={2}>
                    {items.map(({ icon, title, text }: any, index: number) => (
                        <Col colSize={{ md: 6, xs: 12 }} key={index}>
                            <Image alt={`${title} icon`} {...icon} h={2.5} w={2.5} />
                            <Text g900 medium mt={1.25}>
                                {title}
                            </Text>
                            <RichText content={text} g500 mt={0.5} small />
                        </Col>
                    ))}
                </Row>
            </Box>
            <Box fLayout="end" mt={2} right w="100%">
                <Button fluid="md" onClick={() => { acceptCommunityRules(); handleClose(); }}>
                    {buttonLabel}
                </Button>
            </Box>
        </ModalWrapper>
    )
}

export default Rules;
