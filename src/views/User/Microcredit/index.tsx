import { Box, Tab, TabList, TabPanel, Tabs } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import ApplicationHistory from './ApplicationHistory';
import Documents from './Documents';
import RepaymentHistory from './RepaymentHistory';

const Microcredit = (props: { borrower: any }) => {
    const { borrower } = props;
    const { extractFromView } = usePrismicData();
    const { repaymentHistory } = extractFromView('microcredit') as any;

    return (
        <Tabs>
            {/* @ts-ignore */}
            <TabList buttonStyle>
                <Tab title={repaymentHistory} />
                <Tab title="Documents" />
                <Tab title="Application History" />
            </TabList>
            <TabPanel>
                <Box mt={0.5}>
                    <RepaymentHistory borrower={borrower} />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box mt={0.5}>
                    <Documents docs={borrower?.docs} />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box mt={0.5}>
                    <ApplicationHistory borrower={borrower} />
                </Box>
            </TabPanel>
        </Tabs>
    );
};

export default Microcredit;
