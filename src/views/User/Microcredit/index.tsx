import { Box, Tab, TabList, TabPanel, Tabs } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import ApplicationHistory from './ApplicationHistory';
import Documents from './Documents';
import RepaymentHistory from './RepaymentHistory';

const Microcredit = (props: { user: any }) => {
    const { user } = props;
    const { extractFromView } = usePrismicData();
    const { repaymentHistory, documents, applicationHistory } = extractFromView(
        'microcredit'
    ) as any;

    return (
        <Tabs>
            {/* @ts-ignore */}
            <TabList buttonStyle>
                <Tab title={repaymentHistory} />
                <Tab title={documents} />
                <Tab title={applicationHistory} />
            </TabList>
            <TabPanel>
                <Box mt={0.5}>
                    <RepaymentHistory user={user} />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box mt={0.5}>
                    <Documents user={user} />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box mt={0.5}>
                    <ApplicationHistory user={user} />
                </Box>
            </TabPanel>
        </Tabs>
    );
};

export default Microcredit;
