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
import { styled } from 'styled-components';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import BorrowersList from './BorrowersList';
import React, { useState } from 'react';
import RichText from 'src/libs/Prismic/components/RichText';
import Signature from 'src/components/Signature';
import useFilters from 'src/hooks/useFilters';
import useMicrocreditBorrowers from 'src/hooks/useMicrocreditBorrowers';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const itemsPerPage = 7;

const TabPanelStyled = styled(TabPanel)`
    > div {
        margin-top: 0;
    }
`;

const MicrocreditManager: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    const { performanceInfo } = extractFromView('messages') as any;
    const { signature } = useSelector(selectCurrentUser);
    const { update, clear, getByKey } = useFilters();
    const page = getByKey('page') ? +getByKey('page') : 1;
    const actualPage = page - 1 >= 0 ? page - 1 : 0;
    const [itemOffset, setItemOffset] = useState(page * itemsPerPage || 0);

    const { borrowers, count, loadingBorrowers } = useMicrocreditBorrowers([
        `limit=${itemsPerPage}`,
        `offset=${itemOffset}`,
        `orderBy=${getByKey('orderBy') || 'lastRepayment'}`,
        `${getByKey('filter') ? `filter=${getByKey('filter')}` : ''}`
    ]);

    const { count: countAll } = useMicrocreditBorrowers();
    const { count: countNeedHelp } = useMicrocreditBorrowers([
        'filter=need-help'
    ]);
    const { count: countFullyRepaid } = useMicrocreditBorrowers([
        'filter=repaid'
    ]);
    const { count: countOntrack } = useMicrocreditBorrowers(['filter=ontrack']);

    const tabData = [
        {
            number: countAll || 0,
            onClick: () => {
                update({ page: 1 });
                clear('filter');
            },
            title: t('all')
        },
        {
            number: countOntrack || 0,
            onClick: () => update({ filter: 'ontrack', page: 1 }),
            title: t('ontrack')
        },
        {
            number: countNeedHelp || 0,
            onClick: () => update({ filter: 'need-help', page: 1 }),
            title: t('needHelp')
        },
        {
            number: countFullyRepaid || 0,
            onClick: () => update({ filter: 'repaid', page: 1 }),
            title: t('fullyRepaid')
        }
    ];

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
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
                    </TabList>
                    <TabPanel>
                        <Tabs>
                            <TabList>
                                {tabData.map((tab, key) => (
                                    <Tab
                                        key={key}
                                        title={tab.title}
                                        number={tab.number}
                                        onClick={tab.onClick}
                                    />
                                ))}
                            </TabList>
                            <RichText
                                content={performanceInfo}
                                g500
                                // @ts-ignore
                                style={{ fontSize: '0.75rem' }}
                                medium
                                right
                                mt={2}
                            />
                            {tabData.map((_, key) => (
                                <TabPanelStyled key={key}>
                                    <Box mt={0.5}>
                                        <BorrowersList
                                            actualPage={actualPage}
                                            itemsPerPage={itemsPerPage}
                                            loadingBorrowers={loadingBorrowers}
                                            page={page}
                                            count={count}
                                            borrowers={borrowers}
                                            setItemOffset={setItemOffset}
                                        />
                                    </Box>
                                </TabPanelStyled>
                            ))}
                        </Tabs>
                    </TabPanel>
                </Tabs>
            )}
        </ViewContainer>
    );
};

export default MicrocreditManager;
