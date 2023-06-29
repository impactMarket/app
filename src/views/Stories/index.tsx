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
import { userBeneficiary, userDonor } from '../../utils/users';
import CanBeRendered from '../../components/CanBeRendered';
import Filters from './Filters';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import StoryList from './StoryList';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const Stories: React.FC<{ isLoading?: boolean }> = (props) => {
    const [refreshStories, setRefreshStories] = useState(false);
    const { clear, update, getByKey } = useFilters();
    const { isLoading } = props;
    const { view } = usePrismicData();
    const { t } = useTranslations();
    const auth = useSelector(selectCurrentUser);
    const FakeTabPanel = TabPanel as any;
    const types = [userDonor, userBeneficiary];
    const { address } = useWallet();
    const validation =
        address &&
        auth?.user &&
        auth?.type?.some((value: string) => types.includes(value));

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <Row>
                <Col
                    colSize={
                        validation ? { sm: 8, xs: 12 } : { sm: 12, xs: 12 }
                    }
                >
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
                    <Col
                        colSize={validation ? { sm: 4, xs: 12 } : { sm: 0 }}
                        tAlign={{ sm: 'right', xs: 'left' }}
                    >
                        <Button
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
            {auth?.user && (
                <Tabs defaultIndex={getByKey('user') ? 1 : 0}>
                    <TabList>
                        <Tab
                            onClick={() => clear('user')}
                            title={t('allStories')}
                        />
                        <CanBeRendered types={['beneficiary', 'manager']}>
                            <Tab
                                onClick={() =>
                                    update('user', auth?.user?.address)
                                }
                                title={t('myStories')}
                            />
                        </CanBeRendered>
                    </TabList>
                    <FakeTabPanel />
                    <FakeTabPanel />
                </Tabs>
            )}
            <Filters />
            <StoryList refreshStory={refreshStories} />
        </ViewContainer>
    );
};

export default Stories;
