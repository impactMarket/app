import { useSelector } from 'react-redux';
import React from 'react';

import { Box, Button, DropdownMenu, Icon, openModal } from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import Link from 'next/link';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Actions = ({
    buttonLoading,
    community,
    updateReview,
    thegraphData
}: any) => {
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);

    return (
        <Box
            flex
            fLayout={{ sm: 'center end', xs: 'center start' }}
            style={{ gap: '1rem' }}
            fWrap={{ sm: 'nowrap', xs: 'wrap' }}
        >
            {(community?.review === 'pending' ||
                community?.review === 'declined') &&
                !!user?.ambassador && (
                    <Box>
                        <Button
                            isLoading={
                                !!(
                                    buttonLoading.state &&
                                    buttonLoading.button === 'claimed'
                                )
                            }
                            onClick={() => updateReview('claimed')}
                        >
                            <String id="claim" />
                        </Button>
                    </Box>
                )}
            {(community?.review === 'pending' ||
                community?.review === 'declined') &&
                !!user?.ambassador &&
                community?.review !== 'declined' && (
                    <Box>
                        <Button
                            isLoading={
                                !!(
                                    buttonLoading.state &&
                                    buttonLoading.button === 'declined'
                                )
                            }
                            onClick={() => updateReview('declined')}
                            secondary
                        >
                            <String id="decline" />
                        </Button>
                    </Box>
                )}
            {(((community?.review === 'claimed' ||
                community?.review === 'accepted') &&
                community?.ambassadorAddress?.toLowerCase() ===
                    user?.address?.toLowerCase()) ||
                !!user?.councilMember) && (
                <Box>
                    <Link href={`/communities/edit/${community.id}`} passHref>
                        <Button>
                            <Icon icon="edit" margin="0 0.5 0 0" n01 />
                            <String id="edit" />
                        </Button>
                    </Link>
                </Box>
            )}
            {community?.review === 'claimed' &&
                community?.review !== 'accepted' &&
                community?.ambassadorAddress?.toLowerCase() ===
                    user?.address?.toLowerCase() && (
                    <Box>
                        <DropdownMenu
                            asButton
                            items={[
                                {
                                    icon: 'eye',
                                    onClick: () => updateReview('accepted'),
                                    title: 'Accept community'
                                }
                            ]}
                            rtl
                            title={t('actions')}
                        />
                    </Box>
                )}
            {!!user?.councilMember && community?.contractAddress && (
                <Box>
                    <Button
                        error
                        onClick={() =>
                            openModal('removeCommunity', {
                                community,
                                thegraphData
                            })
                        }
                    >
                        <Icon icon="trash" margin="0 0.5 0 0" n01 />
                        {/* <String id="edit" /> */}
                        Remove Community
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Actions;
