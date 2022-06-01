import React from 'react';

import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    Icon,
    Tab,
    TabList,
    Tabs,
    Text,
    openModal
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Managers = ({ community, managers } : any) => {
    const { t } = useTranslations();

    return (
        !!Object.keys(community).length && (
            <>
                <Box mb={2} mt={3}>
                    <Tabs>
                        <TabList>
                            <Tab
                                title={t('managers')}
                            />
                            <Tab
                                title={t('ambassadors')}
                            />
                            <Tab
                                title={t('merchands')}
                            />
                        </TabList>
                    </Tabs>
                </Box>

               <Box mb={1} right>
                    <Button
                        icon="userPlus"
                        margin="0 0.5 0 0"
                        onClick={() =>
                            openModal('addManager')
                        }
                    >
                        <String id="addNewManager"/>
                    </Button>
                </Box> 

                <Grid cols={{ sm: 3, xs: 1 }}>
                    {managers?.map((manager: any, key: number) => (
                        <Card key={key}>
                            <Box fLayout="center start" inlineFlex mb={1}>
                                <Box mr={1}>
                                    <Avatar
                                        url={manager.avatar}
                                    />
                                </Box>
                                <Box>
                                    <Text g900 medium>{manager.name}</Text>
                                    <Box fLayout="center start" inlineFlex>
                                        <Text p600>{manager.id}</Text>
                                        <Icon
                                            icon="chevronDown"
                                            p600
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Box  fLayout="center start" inlineFlex mb={0.3}>
                                <Icon
                                    g500
                                    icon="users"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{manager.beneficiaries}</Text>
                            </Box>
                            <Box fLayout="center start" inlineFlex>
                                <Icon
                                    g500
                                    icon="clock"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{manager.manager}</Text>
                            </Box>
                            <Divider/>
                            <Box fLayout="center start" inlineFlex mb={0.3}>
                                <Icon
                                    g500
                                    icon="mail"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{manager.mail}</Text>
                            </Box>
                            <Box fLayout="center start" inlineFlex>
                                <Icon
                                    g500
                                    icon="mail"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{manager.phone}</Text>
                            </Box>
                            <Box center mt={1}>
                                <Button secondary>
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
            </>
        )
)}

export default Managers;
