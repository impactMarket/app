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


const SingleRequest: React.FC<{ isLoading?: boolean; communityId: any; }> = (props) => {
    const { isLoading } = props;

    const [communityId] = useState(props.communityId);
    const [community, setCommunity]= useState({}) as any;

    const [loading, setLoading] = useState(false);

    //  REVIEW HAS 4 STATES: 'pending', 'accepted', 'claimed', 'declined'

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();

    //  GET COMMUNITY DATA ON FIRST RENDER
    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const community: any = await getCommunity(communityId);
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

            const community: any = await getCommunity(communityId);
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
                                    <Icon
                                        icon="edit"
                                        n01
                                        margin={'0 0.5 0 0'}
                                    />
                                    Edit Details
                                </Button>
                                <DropdownMenu
                                    rtl
                                    asButton
                                    title="Actions"
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
                                        }
                                    ]}
                                />                               
                            </Box>
                        )}
                    </Grid>

                    <Grid cols={4}>
                        <Card>
                            <Text regular small g500 mb={0.3}>
                                # Beneficiaries
                            </Text>
                            <Grid cols={2}>
                                <Text semibold medium g900>
                                    {community.state &&
                                        !!Object.keys(community).length &&
                                        community.state.beneficiaries}
                                    99
                                </Text>
                                <Box right>
                                    <Icon icon="users" s600 />
                                </Box>
                            </Grid>
                        </Card>
                        <Card>
                            <Text regular small g500 mb={0.3}>
                                Claimed per beneficiary
                            </Text>
                            <Grid cols={2}>
                                <Text semibold medium g900>
                                    {community.state &&
                                        !!Object.keys(community).length &&
                                        community.state.claims}
                                    99
                                </Text>
                                <Box right>
                                    <Icon icon="heart" s600 />
                                </Box>
                            </Grid>
                            
                        </Card>
                        <Card>
                            <Text regular small g500 mb={0.3}>
                                Maximum per beneficiary
                            </Text>
                            <Grid cols={2}>
                                <Text semibold medium g900>
                                    99
                                </Text>
                                <Box right>
                                    <Icon icon="check" s600 />
                                </Box>
                            </Grid>
                        </Card>
                        <Card>
                            <Text regular small g500 mb={0.3}>
                                Time increment
                            </Text>
                            <Grid cols={2}>
                                <Text semibold medium g900>
                                    5 minutes
                                </Text>
                                <Box right>
                                    <Icon icon="clock" s600 />
                                </Box>
                            </Grid>
                            
                        </Card>
                    </Grid>
                </>
            )}
        </ViewContainer>
    );
};

export default SingleRequest;
