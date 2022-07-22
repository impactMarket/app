import { useSelector } from 'react-redux';
import React from 'react';

import {
    Box,
    Button,
    DropdownMenu,
    Icon,
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import Link from 'next/link';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Review = ({ buttonLoading, community, updateReview }: any) => {
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);

    return (
        <Box flex>
            {((community?.review === 'pending' || community?.review === 'declined') && !!user?.ambassador) && (
                <Box fGrow={1} fLayout={{ sm: 'end', xs: 'start'}} flex>
                    {community?.review !== 'declined' && (
                        <Button
                            isLoading={!!(buttonLoading.state && buttonLoading.button === 'declined')}
                            mr={1}
                            onClick={() => updateReview('declined')}
                            secondary
                        >
                            <String id="decline" />
                        </Button>
                    )}
                    <Button 
                        isLoading={!!(buttonLoading.state && buttonLoading.button === 'claimed')}
                        onClick={() => updateReview('claimed')}
                    >
                        <String id="claim" />
                    </Button>
                </Box>
            )}

                {(((community?.review === 'claimed' || community?.review === 'accepted') && (community?.ambassadorAddress?.toLowerCase() === user?.address?.toLowerCase())) || (!!user?.manager?.community && (user?.manager?.community?.toLowerCase() === community?.contractAddress?.toLowerCase()))) && (
                    <Box fGrow={1} fLayout="end" flex inlineFlex>
                        <Link href={`/manager/communities/${community.id}`} passHref>
                            <Button>
                                <Icon icon="edit" margin="0 0.5 0 0" n01 />
                                <String id="edit" />
                            </Button>
                        </Link>
                    </Box>
                )}

                {(community?.review === 'claimed' && community?.review !== 'accepted' && community?.ambassadorAddress?.toLowerCase() === user?.address?.toLowerCase()) && (
                    <Box ml={1}>
                        <DropdownMenu
                            asButton
                            items={[
                                {
                                    icon: 'eye',
                                    onClick: () =>
                                        updateReview(
                                            'accepted'
                                        ),
                                    title: 'Accept community'
                                }
                            ]}
                            rtl
                            title={t('actions')}
                        />
                    </Box>
                )}
        </Box>
    )
};

export default Review;
