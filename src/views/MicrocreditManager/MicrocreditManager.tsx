import {
    Box,
    Display,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from 'src/state/slices/auth';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import BorrowersList from './BorrowersList';
import React from 'react';
import RichText from 'src/libs/Prismic/components/RichText';
import Signature from 'src/components/Signature';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';
import RequestTab from './RequestTab';

const MicrocreditManager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    const { signature } = useSelector(selectCurrentUser);
   
    return (
        <ViewContainer isLoading={isLoading}>
            <Box
                fDirection={{ sm: 'row', xs: 'column' }}
                fLayout="start between"
                flex
            >
                <Box>
                    <Display g900 medium>
                        {title}
                    </Display>
                    <RichText content={content} g500 mt={0.25} />
                </Box>
            </Box>
            {!signature && <Signature />}
            {signature && (
                <Tabs>
                    <TabList>
                        <Tab title={t('repayments')} />
                        <Tab title={'Borrowers'} />
                    </TabList>
                    <TabPanel>
                        <Box mt={0.5}>
                            <BorrowersList />
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box mt={0.5}>
                            <RequestTab  />
                        </Box>
                    </TabPanel>
                </Tabs>
            )}
        </ViewContainer>
    );
};

export default MicrocreditManager;
