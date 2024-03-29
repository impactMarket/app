import { useSelector } from 'react-redux';
import React from 'react';

import {
    Avatar,
    Box,
    Divider,
    DropdownMenu,
    Icon,
    Label,
    Text,
    toast
} from '@impact-market/ui';

import { dateHelpers } from '../helpers/dateHelpers';
import { formatAddress } from '../utils/formatAddress';
import { getImage } from '../utils/images';
import { selectCurrentUser } from '../state/slices/auth';
import Message from '../libs/Prismic/components/Message';
import config from '../../config';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const UserCard = ({ community, data, requestedCommunity }: any) => {
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);

    const copyToClipboard = (address: any) => {
        navigator.clipboard.writeText(address);

        toast.success(<Message id="copiedAddress" />);
    };

    return (
        <>
            <Box fLayout="center start" inlineFlex mb={1}>
                <Box mr={1}>
                    <Avatar
                        url={getImage({
                            filePath: data?.avatarMediaPath,
                            fit: 'cover'
                        })}
                    />
                </Box>
                <Box>
                    {(data?.name || data?.firstName || data?.lastName) && (
                        <Text g900 medium>
                            {data?.name}
                            {data?.firstName} {data?.lastName}
                        </Text>
                    )}
                    {data?.address && (
                        <Box fLayout="center start" inlineFlex>
                            <DropdownMenu
                                {...({} as any)}
                                icon="chevronDown"
                                items={[
                                    {
                                        icon: 'open',
                                        onClick: () =>
                                            window.open(
                                                config.explorerUrl?.replace(
                                                    '#USER#',
                                                    data?.address
                                                )
                                            ),
                                        title: t('openInExplorer')
                                    },
                                    {
                                        icon: 'copy',
                                        onClick: () =>
                                            copyToClipboard(data?.address),
                                        title: t('copyAddress')
                                    }
                                ]}
                                title={formatAddress(data?.address, [6, 5])}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
            {data.state === 1 && (
                <Box mb={1}>
                    <Label content={t('removed')} />
                </Box>
            )}
            {(data?.added || data?.added === 0) && (
                <Box mb={0.3}>
                    <Box fLayout="center start" inlineFlex>
                        <Icon g500 icon="users" margin="0 0.5 0 0" />
                        <Box>
                            <Message
                                g500
                                id="onboardedBeneficiaries"
                                small
                                variables={{
                                    value: data?.added ? data?.added : '0'
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            )}
            {data?.since || data?.until ? (
                <Box>
                    <Box fLayout="center start" inlineFlex>
                        <Icon g500 icon="clock" margin="0 0.5 0 0" />
                        <Box>
                            <Message
                                g500
                                id="managerFrom"
                                small
                                variables={{
                                    since: dateHelpers.unix(data?.since),
                                    until: dateHelpers.unix(data?.until)
                                        ? dateHelpers.unix(data?.until)
                                        : t('present')
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            ) : (
                ''
            )}

            {/* If user is ambassador or manager from this community or this community is in request state, show email + phone */}
            {!!user?.ambassador?.communities.includes(community?.id) ||
                user?.manager?.community === community?.id ||
                (requestedCommunity && (
                    <>
                        <Divider />
                        {data?.email && (
                            <Box mb={0.3}>
                                <Box fLayout="center start" inlineFlex>
                                    <Icon g500 icon="mail" margin="0 0.5 0 0" />
                                    <Box>
                                        <Text g500 small>
                                            {data?.email}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                        {data?.phone && (
                            <Box>
                                <Box fLayout="center start" inlineFlex>
                                    <Icon
                                        g500
                                        icon="phone"
                                        margin="0 0.5 0 0"
                                    />
                                    <Box>
                                        <Text g500 small>
                                            {data?.phone}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </>
                ))}
        </>
    );
};

export default UserCard;
