import {
    Button,
    Col,
    Display,
    Row,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import CanBeRendered from '../../components/CanBeRendered';
import Filters from './Filters';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import StoryList from './StoryList';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Stories: React.FC<{ isLoading?: boolean }> = (props) => {
    const [refreshStories, setRefreshStories] = useState(false);
    const { clear, update } = useFilters();
    const { isLoading } = props;
    const { view } = usePrismicData();
    const { t } = useTranslations();
    const auth = useSelector(selectCurrentUser);

    const FakeTabPanel = TabPanel as any;

    return (
        <ViewContainer isLoading={isLoading}>
            <Row>
                <Col colSize={{ sm: 9, xs: 12 }}>
                    <Display medium>
                        <String id="stories" />
                    </Display>

                    <RichText
                        content={view.data.headingContent}
                        g500
                        mt={0.25}
                    />
                </Col>
                <CanBeRendered types={['beneficiary', 'manager']}>
                    <Col colSize={{ sm: 3, xs: 12 }} right>
                        <Button
                            fluid="xs"
                            icon="plus"
                            onClick={() =>
                                openModal('createStory', { setRefreshStories })
                            }
                        >
                            <String id="createStory" />
                        </Button>
                    </Col>
                </CanBeRendered>
            </Row>
            <Tabs>
                <TabList>
                    <Tab
                        onClick={() => clear('user')}
                        title={t('allStories')}
                    />

                    <CanBeRendered types={['beneficiary', 'manager']}>
                        <Tab
                            onClick={() => update('user', auth?.user?.address)}
                            title={t('myStories')}
                        />
                    </CanBeRendered>
                </TabList>
                <Filters />
                <FakeTabPanel />
                <FakeTabPanel/>
            </Tabs>
            <StoryList refreshStory={refreshStories} />
        </ViewContainer>
    );
};

export default Stories;