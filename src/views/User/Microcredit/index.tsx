import { Box, Tab, TabList, TabPanel, Tabs,Button, openModal } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import CommunicationHistory from './CommunicationHistory';
import RepaymentHistory from './RepaymentHistory';
import useFilters from 'src/hooks/useFilters';
import Documents from './Documents';
import ApplicationHistory from './ApplicationHistory';
import { useEffect, useState, useMemo, useRef} from 'react';

const Microcredit = (props: { user: any }) => {
    const { user } = props;
    const { extractFromView } = usePrismicData();
    const { update, getByKey } = useFilters();
    const [tab, setTab] = useState(0);
    const tabsRef = useRef(null);

    const tabKey = useMemo(() => getByKey('tab'), [getByKey]);

    useEffect(() => {
        if (!tabKey) {
            update({
                tab: 'repaymentHistory'
            });
        }
    }, [tabKey, update]); 

    useEffect(() => {        
        switch (tabKey) {
            case "repaymentHistory":
                setTab(0);
                break;
            case "documents":
                setTab(1);
                break;
            case "applicationHistory":
                setTab(2);
                break;
            case 'communicationHistory':
                setTab(3);
                break;
            default:
                setTab(0);
        }
    }, [tabKey]); 

    useEffect(() => {
        
        if (tabsRef.current) {
            const tabElement = tabsRef.current.querySelector(`[data-key="${tabKey}"]`);
            if (tabElement) {
                tabElement.click();
            }
        }
    }, [tabKey]);
    




    const { repaymentHistory, documents, applicationHistory } = extractFromView(
        'microcredit'
    ) as any;

    return (

        <Tabs defaultIndex={tab} >
            {/* @ts-ignore */}
            <Box flex fLayout="center between" w="100%" ref={tabsRef} >
                <TabList >
                    <Tab 
                        data-key="repaymentHistory"
                        title={repaymentHistory} 
                        onClick={() => {
                            update({
                                tab: "repaymentHistory"
                            });
                        }}
                    />
                    <Tab 
                        data-key="documents"
                        title={documents} 
                        onClick={() => {
                            update({
                                tab: "documents"
                            }); 
                        }}
                    />
                    <Tab 
                        data-key="applicationHistory"
                        title={applicationHistory} 
                        onClick={() => {
                            update({
                                tab: "applicationHistory"
                            });
                        }}
                    />
                    <Tab 
                        data-key="communicationHistory"
                        title="Communication History"
                        onClick={() => {
                            update({
                                tab: 'communicationHistory'
                            });
                        }} 
                    />
                </TabList>
                {tab === 3 ? 
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