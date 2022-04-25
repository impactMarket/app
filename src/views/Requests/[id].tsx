import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Card,
    Display,
    DropdownMenu,
    Grid,
    Icon,
    Text,
    ViewContainer,
    Spinner
} from '@impact-market/ui';

import { useUpdateReviewMutation } from '../../api/community';
import { useGetCommunityMutation } from '../../api/community';

const SingleRequest: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const [communityId] = useState(props.communityId);
    const [community, setCommunity] = useState({});

    const [loading, setLoading] = useState(false);

    //  REVIEW HAS 4 STATES: 'pending', 'accepted', 'claimed', 'declined'

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();

    //  GET COMMUNITY DATA ON FIRST RENDER
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const community = await getCommunity(communityId);
                setCommunity(community.data);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, []);

    //  UPDATE COMMUNITY REVIEW STATE AND GET NEW DATA
    const UpdateReview = async (review: string) => {
        try {
            setLoading(true);

            await updateReview({
                body: {
                    review: review
                },
                id: communityId
            });

            const community = await getCommunity(communityId);
            setCommunity(community.data);

            setLoading(false);
        } catch (error) {
            console.log(error);

            return false;
        }
    };

    console.log(community);

    return (
        <ViewContainer isLoading={isLoading}>
            {loading ? (
                <Spinner isActive />
            ) : (
                <>
                    <Grid cols={2}>
                        <Box>
                            <Display>{community.name}</Display>
                            <Text g500 mt={0.25} extrasmall medium>
                                {community.country}
                                {community.city}
                            </Text>
                        </Box>

                        {community.review === 'pending' && (
                            <Box right>
                                <Button
                                    secondary
                                    mr={1}
                                    onClick={() => UpdateReview('declined')}
                                >
                                    Decline
                                </Button>
                                <Button
                                    onClick={() => UpdateReview('accepted')}
                                >
                                    Accept/Claim
                                </Button>
                            </Box>
                        )}

                        {community.review === 'accepted' && (
                            <Box right>
                                <Button mr={1}>
                                    <Icon icon="edit" n01 margin={'0 0.5 0 0'} />
                                    Edit Details
                                </Button>
                                <DropdownMenu 
                                    title="Actions"
                                    asButton
                                    items={[
                                        {
                                            icon: 'eye',
                                            onClick: () => alert('Release community'),
                                            title: 'Release community'
                                        },
                                        {
                                            icon: 'key',
                                            onClick: () => alert('Submit to Proposal'),
                                            title: 'Submit to Proposal'
                                        },
                                    ]}
                                />
                            </Box>
                        )}
                    </Grid>
                    <Grid cols={4}>
                        <Card>
                            <Text regular small g500>
                                # Beneficiaries
                            </Text>
                            <Text semibold medium g900>
                                {community.state &&
                                    Object.keys(community).length > 0 &&
                                    community.state.beneficiaries}
                            </Text>
                        </Card>
                        <Card>
                            <Text regular small g500>
                                Claimed per beneficiary
                            </Text>
                            <Text semibold medium g900>
                                {community.state &&
                                    Object.keys(community).length > 0 &&
                                    community.state.claims}
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
                </>
            )}
        </ViewContainer>
    );
};

export default SingleRequest;
