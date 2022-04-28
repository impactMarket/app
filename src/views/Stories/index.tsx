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
import { checkUserPermission } from '../../utils/userTypes';
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
    const user = auth?.user;
    const userTypes = auth?.type;
    const userAddress = auth?.user?.address;

    const userPermissions = (user: any, types: string[]) => {
        return checkUserPermission(user, types);
    };

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

                {userPermissions(user, userTypes) && (
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

                    {userPermissions(user, userTypes) && (
                        <Tab
                            onClick={() => update('user', userAddress)}
                            title={t('myStories')}
                        />
                    )}
                </TabList>
                <Filters />
                <TabPanel>
                    <StoryList refreshStory={refreshStories} />
                </TabPanel>
                <TabPanel>
                    <StoryList refreshStory={refreshStories} />
                </TabPanel>
            </Tabs>
        </ViewContainer>
    );
};

export default Stories;
