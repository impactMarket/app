import {
    Button,
    Col,
    Display,
    Row,
    Tab,
    TabList,
    Tabs,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import {
    checkUserPermission,
    userBeneficiary,
    userManager
} from '../../utils/users';
import { selectCurrentUser } from '../../state/slices/auth';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
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

                {checkUserPermission([userManager, userBeneficiary]) && (
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
                )}
            </Row>
            <Tabs>
                <TabList>
                    <Tab
                        onClick={() => clear('user')}
                        title={t('allStories')}
                    />

                    {checkUserPermission([userManager, userBeneficiary]) && (
                        <Tab
                            onClick={() => update('user', auth?.user?.address)}
                            title={t('myStories')}
                        />
                    )}
                </TabList>
                <Filters />
            </Tabs>
            <StoryList refreshStory={refreshStories} />
        </ViewContainer>
    );
};

export default Stories;
