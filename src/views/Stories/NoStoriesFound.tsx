import { Box, Row } from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';

const NoStoriesFound = () => {
    const { view } = usePrismicData();

    return (
        <Box mt="25vh">
            <Row fLayout="center">
                <RichText content={view.data.emptyStateTitle} g900 medium />
            </Row>
            <Row fLayout="center">
                <RichText content={view.data.emptyStateContent} g500 regular />
            </Row>
        </Box>
    );
};

export default NoStoriesFound;
