/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Display, DropdownMenu, Label, Tab, TabList, TabPanel, Tabs, Text, TextLink, ViewContainer, toast } from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { getUserName, userManager } from '../../utils/users';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetUserByIdMutation } from '../../api/user';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import StateButtons from './StateButtons';
import String from '../../libs/Prismic/components/String';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const BeneficiaryDetail: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [loadingUser, toggleLoadingUser] = useState(true);
    const [user, setUser] = useState({}) as any;

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();
    const [getUser] = useGetUserByIdMutation();

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    useEffect(() => {
        const init = async () => {
            try {
                const id = router?.query?.id as any;
                const data = await getUser(id).unwrap();

                setUser(data);

                toggleLoadingUser(false);
            }
            catch (error) {
                console.log(error);

                toggleLoadingUser(false);

                router.push('/manager/beneficiaries');

                return false;
            }
        };

        init();
    }, []);

    const copyToClipboard = () => {
        navigator?.clipboard.writeText(user?.address);

        toast.success(<Message id="copiedAddress" />);
    }

    return (
        <ViewContainer isLoading={isLoading || loadingUser}>
            <TextLink fLayout="center start"  flex onClick={() => router.back()}>
                <Label content={<String id="back" />} icon="arrowLeft" ml={0} />
            </TextLink>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex mt={1.5}>
                <Box fLayout="center start" flex>
                    {!!user?.avatarMediaPath ? 
                        <Avatar mr={1.375} small url={getImage({ filePath: user.avatarMediaPath, fit: 'cover', height: 66, width: 66 })} />  
                        : 
                        <CircledIcon h={4.125} icon="user" large mr={1.375} w={4.125} />
                    }
                    <Box column flex>
                        {(!!user?.firstName || !!user?.lastName) && (
                            <Display g900 mb={0.25} medium>
                                {getUserName(user)}
                            </Display>
                        )}
                        <DropdownMenu
                            icon="chevronDown"
                            items={[
                                {
                                    icon: 'open',
                                    onClick: () => window.open(config.explorerUrl?.replace('#USER#', user?.address)),
                                    title: t('openInExplorer')
                                },
                                {
                                    icon: 'copy',
                                    onClick: () => copyToClipboard(),
                                    title: t('copyAddress')
                                }
                            ]}
                            title={formatAddress(user?.address, [6, 4])}
                        />
                    </Box>
                </Box>
                <Box mt={{ sm: 0, xs: 1 }}>
                    <StateButtons beneficiary={user} community={auth?.user?.manager?.community} />
                </Box>
            </Box>
            <Box mt={0.5}>
                <Tabs>
                    { /* TODO: finish the info for the 3 tabs */ }
                    <TabList>
                        <Tab title={t('transactions')} />
                        <Tab title={t('actions')} />
                        <Tab title={t('ubi')} />
                    </TabList>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />
                            <Text g500 medium mt={1}><String id="noTransactionsFound" /></Text>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />
                            <Text g500 medium mt={1}><String id="noActionsFound" /></Text>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />

                            <Text g500 medium mt={1}><String id="noRecordsFounds" /></Text>
                        </Box>
                    </TabPanel>
                </Tabs>
            </Box>
        </ViewContainer>
    );
};

export default BeneficiaryDetail;
