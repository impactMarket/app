import React from 'react';

import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    DropdownMenu,
    Grid,
    Icon,
    Tab,
    TabList,
    Tabs,
    Text,
    openModal,
    toast
} from '@impact-market/ui';

import { dateHelpers } from '../../helpers/dateHelpers'
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import Message from '../../libs/Prismic/components/Message';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const Managers = ({ community, managers, status } : any) => {
    const { t } = useTranslations();
    const { removeManager } = useAmbassador();

    const removeManagerFunc = async (address: any) => {
        try {
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
        }
    }

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    }

    return (
        !!Object.keys(community).length && (
            <>
                <Box mb={2} mt={3}>
                    <Tabs>
                        <TabList>
                            {/* Todo: Add Ambassadors and Merchands tabs*/}
                            <Tab
                                title={t('managers')}
                            />
                        </TabList>
                    </Tabs>
                </Box>

                {status === 'valid' &&
                    <Box mb={1} right>
                        <Button
                            icon="userPlus"
                            margin="0 0.5 0 0"
                            onClick={() =>
                                openModal('addManager', { community })
                            }
                        >
                            <String id="addNewManager"/>
                        </Button>
                    </Box> 
                }

                {!managers?.length ?
                    <String id="noManagers"/>
                :
                    <Grid cols={{ sm: 3, xs: 1 }}>
                        {managers?.map((manager: any, key: number) => (
                            //  Only show active managers
                            (manager?.state === 0 || manager?.state === 'active') &&
                                <Card key={key}>
                                    <Box fLayout="center start" inlineFlex mb={1}>
                                        <Box mr={1}>
                                            <Avatar url={getImage({ filePath: manager?.avatarMediaPath })} />
                                        </Box>
                                        <Box>
                                            {(manager?.firstName && manager?.lastName) && (
                                                <Text g900 medium>{manager?.firstName} {manager?.lastName}</Text>
                                            )}
                                            <Box fLayout="center start" inlineFlex>
                                                <DropdownMenu
                                                    icon="chevronDown"
                                                    items={[
                                                        {
                                                            icon: 'open',
                                                            onClick: () => window.open(config.explorerUrl?.replace('#USER#', manager?.address)),
                                                            title: t('openInExplorer')
                                                        },
                                                        {
                                                            icon: 'copy',
                                                            onClick: () => copyToClipboard(manager?.address),
                                                            title: t('copyAddress')
                                                        }
                                                    ]}
                                                    title={formatAddress(manager?.address, [6, 5])}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box mb={0.3}>
                                        <Box fLayout="center start" inlineFlex>
                                            <Icon
                                                g500
                                                icon="users"
                                                margin="0 0.5 0 0"
                                            />
                                            <Message g500 id="onboardedBeneficiaries" small variables={{ 
                                                value: manager?.added ? manager?.added : '0'
                                            }} />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box fLayout="center start" inlineFlex>
                                            <Icon
                                                g500
                                                icon="clock"
                                                margin="0 0.5 0 0"
                                            />        
                                            <Message g500 id="managerFrom" small variables={{ 
                                                since: dateHelpers.unix(manager?.since), 
                                                until: dateHelpers.unix(manager?.until) ? dateHelpers.unix(manager?.until) : t('present')
                                            }} />
                                        </Box>
                                    </Box>
                                    <Divider/>
                                    {manager?.email &&
                                        <Box mb={0.3}>
                                            <Box fLayout="center start" inlineFlex>
                                                <Icon
                                                    g500
                                                    icon="mail"
                                                    margin="0 0.5 0 0"
                                                />
                                                <Text g500 small>{manager?.email}</Text>
                                            </Box>
                                        </Box>
                                    }
                                    {manager?.phone &&
                                        // Need phone Icon
                                        <Box>
                                            <Box fLayout="center start" inlineFlex>
                                                <Icon
                                                    g500
                                                    icon="mail"
                                                    margin="0 0.5 0 0"
                                                />
                                                <Text g500 small>{manager?.phone}</Text>
                                            </Box>
                                        </Box>
                                    }
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
                                </Card>
                        ))}
                    </Grid> 
                }                
            </>
        )
)}

export default Managers;
