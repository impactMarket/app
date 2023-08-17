import { Box, Tab, TabList, TabPanel, Tabs,Button, openModal } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import CommunicationHistory from './CommunicationHistory';
import RepaymentHistory from './RepaymentHistory';
import useFilters from 'src/hooks/useFilters';

const Microcredit = (props: { user: any }) => {
    const { user } = props;
    const { extractFromView } = usePrismicData();
    const {  update,getByKey } = useFilters();



    const setDefaultTab = () => {
        const tab = getByKey('tab');

        console.log("TAB: ",tab);
        
        switch (tab) {
            case 'RepaymentHistory':
                return 0;
            case 'CommunicationHistory':
                return 1;
            default:
                return 0;
        }
    }


    const { repaymentHistory, documents, applicationHistory } = extractFromView(
        'microcredit'
    ) as any;

    return (
        <Tabs defaultIndex={setDefaultTab()}>
            {/* @ts-ignore */}
            <Box flex fLayout="center between" w="100%">
                <TabList>
                    <Tab 
                        title={repaymentHistory} 
                        onClick={() => {
                            update({
                                tab: `${repaymentHistory}`
                            });
                        }}
                    />
                    <Tab 
                        title={documents} 
                        onClick={() => {
                            update({
                                tab: `${documents}`
                            }); 
                        }}
                    />
                    <Tab 
                        title={applicationHistory} 
                        onClick={() => {
                            update({
                                tab: `${applicationHistory}`
                            });
                        }}
                    />
                    <Tab 
                        title="Communication History"
                        onClick={() => {
                            update({
                                tab: 'CommunicationHistory'
                            });
                        }} 
                    />
                </TabList>
                {setDefaultTab() === 1 ? 
                        <Button 
                            icon="coment"
                            onClick={()=> {
                                openModal('addNote',
                                    {
                                        borrowerAdd: user?.address,
                                    }
                                )
                            }}
                        >
                            Add Note
                        </Button>
                    : null
                }
            </Box>

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
            <TabPanel>
                <Box mt={0.5}>
                    <CommunicationHistory user={user}/>
                </Box>
            </TabPanel>
        </Tabs>
    );
};

export default Microcredit;
