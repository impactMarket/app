import { Box, Display, Tab, TabList, Tabs, ViewContainer } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import BorrowersList from './BorrowersList';
import React from 'react';
import RichText from 'src/libs/Prismic/components/RichText';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const MicrocreditManager: React.FC<{ isLoading?: boolean; }> = (props) => {
    const { isLoading } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    return (
        <ViewContainer isLoading={isLoading}>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex>
                <Box>
                    <Display g900  medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
            </Box>
            <Tabs>
                <TabList>
                    <Tab
                        title={t('repayments')}
                    />
                </TabList>
            </Tabs>
            <Box mt={0.5}>
                <BorrowersList />
            </Box>
        </ViewContainer>
    );
};

export default MicrocreditManager;
