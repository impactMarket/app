import { useSelector } from 'react-redux';
import React from 'react';

import {
    Avatar,
    Box,
    Divider,
    DropdownMenu,
    Icon,
    Text,
    toast
} from '@impact-market/ui';

import { dateHelpers } from '../../helpers/dateHelpers'
import { formatAddress } from '../../utils/formatAddress';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import Message from '../../libs/Prismic/components/Message';
import config from '../../../config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const UserCard = ({ community, data } : any) => {
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    }

    return (
        <>
            <Box fLayout="center start" inlineFlex mb={1}>
                <Box mr={1}>
                    <Avatar url={getImage({ filePath: data?.avatarMediaPath })} />
                </Box>
                <Box>
                    {(data?.firstName && data?.lastName) && (
                        <Text g900 medium>{data?.firstName} {data?.lastName}</Text>
                    )}
                    <Box fLayout="center start" inlineFlex>
                        <DropdownMenu
                            icon="chevronDown"
                            items={[
                                {
                                    icon: 'open',
                                    onClick: () => window.open(config.explorerUrl?.replace('#USER#', data?.address)),
                                    title: t('openInExplorer')
                                },
                                {
                                    icon: 'copy',
                                    onClick: () => copyToClipboard(data?.address),
                                    title: t('copyAddress')
                                }
                            ]}
                            title={formatAddress(data?.address, [6, 5])}
                        />
                    </Box>
                </Box>
            </Box>
            {(data?.added || data?.added === 0) &&
                <Box mb={0.3}>
                    <Box fLayout="center start" inlineFlex>
                        <Icon
                            g500
                            icon="users"
                            margin="0 0.5 0 0"
                        />
                        <Message g500 id="onboardedBeneficiaries" small variables={{ 
                            value: data?.added ? data?.added : '0'
                        }} />
                    </Box>
                </Box>
            }
            {(data?.since || data?.until) &&
                <Box>
                    <Box fLayout="center start" inlineFlex>
                        <Icon
                            g500
                            icon="clock"
                            margin="0 0.5 0 0"
                        />        
                        <Message g500 id="managerFrom" small variables={{ 
                            since: dateHelpers.unix(data?.since), 
                            until: dateHelpers.unix(data?.until) ? dateHelpers.unix(data?.until) : t('present')
                        }} />
                    </Box>
                </Box>
            }
            
            {/* If user is ambassador or manager from this community, show email + phone */}
            {(!!user?.ambassador?.communities.includes(community?.id) || !!user?.data?.community === community?.id) && (
                <>
                    <Divider/>
                    {data?.email && 
                        <Box mb={0.3}>
                            <Box fLayout="center start" inlineFlex>
                                <Icon
                                    g500
                                    icon="mail"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{data?.email}</Text>
                            </Box>
                        </Box>
                    }
                    {data?.phone &&
                        // Need phone Icon
                        <Box>
                            <Box fLayout="center start" inlineFlex>
                                <Icon
                                    g500
                                    icon="mail"
                                    margin="0 0.5 0 0"
                                />
                                <Text g500 small>{data?.phone}</Text>
                            </Box>
                        </Box>
                    }
                </>
            )}
        </>   
    )
}

export default UserCard;
