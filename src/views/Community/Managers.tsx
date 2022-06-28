import React from 'react';

import {
    Box,
    Button,
    Card,
    Grid,
    Icon,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    openModal,
    toast
} from '@impact-market/ui';

import { useAmbassador } from '@impact-market/utils/useAmbassador';
import CanBeRendered from '../../components/CanBeRendered';
import Message from '../../libs/Prismic/components/Message';
import String from '../../libs/Prismic/components/String';
import UserCard from './UserCard'
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const Managers = ({ ambassador, community, managers, status, setRefreshingPage } : any) => {
    const { t } = useTranslations();
    const { removeManager } = useAmbassador();

    const removeManagerFunc = async (address: any) => {
        try {
            setRefreshingPage(true)

            const { status } = await removeManager(community?.id, address);

            if(status) {
                toast.success(<Message id="managerRemoved" />);
            }
            else {
                toast.error(<Message id="errorOccurred" />);
            }
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);

            setRefreshingPage(false)
        }

        setRefreshingPage(false)
    }

    return (
        !!Object.keys(community).length && (
            <Box mb={2} mt={3}>
                <Tabs>
                    <TabList>
                        {/* Todo: Add Merchands tabs*/}
                        <Tab
                            title={t('managers')}
                        />
                        {ambassador?.active &&
                            <Tab
                                title={t('ambassadors')}
                            />
                        }    
                    </TabList>
                
                    {/* Managers */}
                    <TabPanel>
                        {status === 'valid' &&
                            <CanBeRendered types={['ambassador']}>
                                <Box mb={1} right>
                                    <Button
                                        icon="userPlus"
                                        margin="0 0.5 0 0"
                                        onClick={() =>
                                            openModal('addManager', { community, setRefreshingPage })
                                        }
                                    >
                                        <String id="addNewManager"/>
                                    </Button>
                                </Box> 
                            </CanBeRendered>
                        }

                        {!managers?.length ?
                            <String id="noManagers"/>
                        :
                            <Grid cols={{ sm: 3, xs: 1 }}>
                                {managers?.map((manager: any, key: number) => (
                                    //  Only show active managers
                                    (manager?.state === 0 || manager?.state === 'active') &&
                                        <Card key={key}>
                                            <UserCard
                                                community={community}
                                                data={manager}
                                            />
                                            <CanBeRendered types={['ambassador']}>
                                                <Box center mt={1}>
                                                    <Button onClick={() => removeManagerFunc(manager?.address)} secondary w="100%">
                                                        <Icon
                                                            icon="userMinus"
                                                            margin="0 0.5 0 0"
                                                            p700
                                                        />
                                                        <String id="removeManager"/>
                                                    </Button>
                                                </Box>
                                            </CanBeRendered>
                                        </Card>
                                ))}
                            </Grid> 
                        }   
                    </TabPanel>

                    {/* Ambassador */}
                    {ambassador?.active &&
                        <TabPanel>
                            <Grid cols={{ sm: 3, xs: 1 }}>
                                <Card>
                                    <UserCard
                                        community={community}
                                        data={ambassador}
                                    />
                                </Card>
                            </Grid> 
                        </TabPanel>
                    }
                </Tabs>
            </Box>
        )
)}

export default Managers;