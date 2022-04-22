import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Card,
    Display,
    Grid,
    Text,
    ViewContainer
} from '@impact-market/ui';

import { useUpdateReviewMutation } from '../../api/community';

const SingleRequest: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const community = props.community.data;

    //  REVIEW HAS 4 STATES: 'pending', 'accepted', 'claimed', 'declined'

    const [updateReview] = useUpdateReviewMutation();

    const UpdateReview = async (review: string) => {
        try {
            await updateReview({
                body: {
                    review: review
                },
                id: community.id
            });
            
        } catch (error) {
            console.log(error);

            return false;
        }
    };

    console.log(community);

    return (
        <ViewContainer isLoading={isLoading}>
            <Grid cols={2}>
                <Box>
                    <Display>{community.name}</Display>
                    <Text g500 mt={0.25} extrasmall medium>
                        {community.country}
                        {community.city}
                    </Text>
                </Box>
                <Box right>
                    <Button
                        secondary
                        mr={1}
                        onClick={() => UpdateReview('declined')}
                    >
                        Decline
                    </Button>
                    <Button onClick={() => UpdateReview('accepted')}>
                        Accept/Claim
                    </Button>
                </Box>
            </Grid>
            <Grid cols={4}>
                <Card>
                    <Text regular small g500>
                        # Beneficiaries
                    </Text>
                    <Text semibold medium g900>
                    {community.state &&
                        Object.keys(community).length > 0 &&
                            community.state.beneficiaries
                    }
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Claimed per beneficiary
                    </Text>
                    <Text semibold medium g900>
                    {community.state &&
                        Object.keys(community).length > 0 &&
                            community.state.claims
                    } 
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Maximum per beneficiary
                    </Text>
                    <Text semibold medium g900>
                        500
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Time increment
                    </Text>
                    <Text semibold medium g900>
                        5 minutes
                    </Text>
                </Card>
            </Grid>
        </ViewContainer>
    );
};

export default SingleRequest;
