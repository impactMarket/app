import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Card,
    CountryFlag,
    Display,
    DropdownMenu,
    Grid,
    Icon,
    Label,
    PulseIcon,
    Spinner,
    Text,
    ViewContainer
} from '@impact-market/ui';

import { useGetCommunityMutation, useUpdateReviewMutation } from '../../api/community';
import String from '../../libs/Prismic/components/String';


const SingleRequest: React.FC<{ isLoading?: boolean; communityId: any; }> = (props) => {
    const { isLoading } = props;
    const router = useRouter()

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
    const functionUpdateReview = async (review: string) => {
        try {
            setLoading(true);

            await updateReview({
                body: {
                    review
                },
                id: communityId
            });

            const community: any = await getCommunity(communityId);

            setCommunity(community.data);

            setLoading(false);

            //  SEND TO /REQUESTS IF COMMUNITY WAS DECLINED
            review === 'declined' && router.push('/requests')

        } catch (error) {
            console.log(error);

            return false;
        }
    };

    // console.log(community);

    return (
        <ViewContainer isLoading={isLoading}>
            {loading ? (
                <Spinner isActive />
            ) : (
                <>
                    <Box mb={1.5}>
                        <Link href="/requests" passHref>
                            <Label
                                content={<String id="back"/>}
                                icon="arrowLeft"
                                as="a"
                            />
                        </Link>
                    </Box>
                    
                    <Grid cols={2}>
                        <Box>
                            <Display>{community.name}</Display>
                            <Box inlineFlex mt={0.25}>
                                <CountryFlag
                                    countryCode={community.country}
                                    mr={0.5}
                                    size={[1.5, 1.5]}
                                />
                                <Text extrasmall g500 medium>
                                    {community.city}
                                </Text>
                            </Box>
                        </Box>

                        {(community.review === 'pending' || community.review === 'declined') && (
                            <Box right>
                                {community.review !== 'declined' &&
                                    <Button
                                        mr={1}
                                        onClick={() => functionUpdateReview('declined')}
                                        secondary
                                    >
                                        <String id="decline"/>
                                    </Button>
                                }
                                <Button
                                    onClick={() => functionUpdateReview('claimed')}
                                >
                                    <String id="claim"/>
                                </Button>
                            </Box>
                        )}

                        {(community.review === 'claimed' || community.review === 'accepted') && (
                            <Box right> 
                                {/* TODO: EDIT DETAILS */}
                                <Button>
                                    <Icon
                                        icon="edit"
                                        margin="0 0.5 0 0"
                                        n01
                                    />
                                    <String id="editDetails"/>
                                </Button>
                                {/* ------ */}
                                {community.review !== 'accepted' && (
                                    <DropdownMenu
                                        asButton
                                        items={[
                                            {
                                                icon: 'eye',
                                                onClick: () => functionUpdateReview('accepted'),
                                                title: 'Accept community'
                                            }
                                        ]}
                                        ml={1}
                                        rtl
                                        title={<String id="actions"/>}
                                    />    
                                )}                                     
                            </Box>
                        )}
                    </Grid>

                    <Grid cols={{ sm: 4, xs: 2 }}>
                        <Card>
                            <Text g500 mb={0.3} regular small>
                                # <String id="beneficiaries"/>
                            </Text>
                            <Grid cols={2}>
                                <Text g900 medium semibold>
                                    {community.state &&
                                        !!Object.keys(community).length ? community.state.beneficiaries : '-'
                                    }
                                </Text>
                                <Box right>
                                    <PulseIcon
                                        bgS100
                                        borderColor="s50"
                                        icon="users"
                                        s600
                                        size={2}
                                    />
                                </Box>
                            </Grid>
                        </Card>
                        <Card>
                            <Text g500 mb={0.3} regular small>
                                <String id="claimedPerBeneficiary"/>
                            </Text>
                            <Grid cols={2}>
                                <Text g900 medium semibold>
                                    {community.state && !!Object.keys(community).length ? community.state.claims : '-'}
                                </Text>
                                <Box right>
                                    <PulseIcon
                                        bgS100
                                        borderColor="s50"
                                        icon="heart"
                                        s600
                                        size={2}
                                    />
                                </Box>
                            </Grid>
                            
                        </Card>
                        <Card>
                            <Text g500 mb={0.3} regular small>
                                <String id="maximumPerBeneficiary"/>
                            </Text>
                            <Grid cols={2}>
                                <Text g900 medium semibold>
                                    -
                                </Text>
                                <Box right>
                                    <PulseIcon
                                        bgS100
                                        borderColor="s50"
                                        icon="check"
                                        s600
                                        size={2}
                                    />
                                </Box>
                            </Grid>
                        </Card>
                        <Card>
                            <Text g500 mb={0.3} regular small>
                                <String id="timeIncrement"/>
                            </Text>
                            <Grid cols={2}>
                                <Text g900 medium semibold>
                                    - <String id="minutes"/>
                                </Text>
                                <Box right>
                                    <PulseIcon
                                        bgS100
                                        borderColor="s50"
                                        icon="clock"
                                        s600
                                        size={2}
                                    />
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
