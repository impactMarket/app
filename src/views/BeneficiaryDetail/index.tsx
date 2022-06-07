/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, CircledIcon, Display, DropdownMenu, Icon, Tab, TabList, TabPanel, Tabs, Text, TextLink, ViewContainer, toast } from '@impact-market/ui';
import { formatAddress } from '../../utils/formatAddress';
import { getBeneficiary } from '../../graph/user';
import { selectCurrentUser } from '../../state/slices/auth';
// import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { getImage } from '../../utils/images';
import { getUserName, userManager } from '../../utils/users';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import StateButtons from './StateButtons';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const BeneficiaryDetail: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    // TODO: load information from prismic and use it in the content
    // const { view } = usePrismicData({ list: true });

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const { t } = useTranslations();

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        router.push('/');

        return null;
    }

    // TODO: needs a new request in the API, for now we use TheGraph, but remove this once we have the request
    const beneficiary = useQuery(getBeneficiary, { variables: { id: router?.query?.id } });

    // If there's no Beneficiary with the current address, send to Beneficiaries page
    if(!beneficiary?.loading && !beneficiary?.data) {
        router.push('/manager/beneficiaries');

        return null;
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(auth?.user?.address);

        toast.success(<Message id="copiedAddress" />);
    }

    return (
        <ViewContainer isLoading={isLoading || beneficiary?.loading}>
            <TextLink fLayout="center start" flex onClick={() => router.push('/manager/beneficiaries')}>
                <Icon icon="arrowLeft" mr={0.75} p700 />
                { /* TODO: add text to Prismic */ }
                <Text medium p700 small>Back</Text>
            </TextLink>
            <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout="start between" flex mt={1.5}>
                <Box fLayout="center start" flex>
                    {!!beneficiary?.data?.beneficiaryEntity?.avatarMediaPath ? 
                        <Avatar mr={1.375} small url={getImage({ filePath: beneficiary.data.beneficiaryEntity.avatarMediaPath, fit: 'cover', height: 66, width: 66 })} />  
                        : 
                        <CircledIcon h={4.125} icon="user" large mr={1.375} w={4.125} />
                    }
                    <Box column flex>
                        {(!!beneficiary?.data?.beneficiaryEntity?.firstName || !!beneficiary?.data?.beneficiaryEntity?.lastName) && (
                            <Display g900 mb={0.25} medium>
                                {getUserName(beneficiary.data.beneficiaryEntity)}
                            </Display>
                        )}
                        <DropdownMenu
                            icon="chevronDown"
                            items={[
                                {
                                    icon: 'open',
                                    onClick: () => window.open(config.explorerUrl?.replace('#USER#', beneficiary?.data?.beneficiaryEntity?.address)),
                                    title: t('openInExplorer')
                                },
                                {
                                    icon: 'copy',
                                    onClick: () => copyToClipboard(),
                                    title: t('copyAddress')
                                }
                            ]}
                            title={formatAddress(beneficiary?.data?.beneficiaryEntity?.address, [6, 4])}
                        />
                    </Box>
                </Box>
                <Box mt={{ sm: 0, xs: 1 }}>
                    <StateButtons beneficiary={beneficiary?.data?.beneficiaryEntity} community={auth?.user?.manager?.community} />
                </Box>
            </Box>
            <Box mt={0.5}>
                <Tabs>
                    { /* TODO: add text to Prismic */ }
                    { /* TODO: finish the info for the 3 tabs */ }
                    <TabList>
                        <Tab title="Transactions" />
                        <Tab title="Actions" />
                        <Tab title="UBI" />
                    </TabList>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />
                            { /* TODO: add text to Prismic */ }
                            <Text g500 medium mt={1}>No transactions found.</Text>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />
                            { /* TODO: add text to Prismic */ }
                            <Text g500 medium mt={1}>No actions found.</Text>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box column fLayout="center" flex h="60vh">
                            <CircledIcon icon="forbidden" medium />
                            { /* TODO: add text to Prismic */ }
                            <Text g500 medium mt={1}>No records found.</Text>
                        </Box>
                    </TabPanel>
                </Tabs>
            </Box>
        </ViewContainer>
    );
};

export default BeneficiaryDetail;
