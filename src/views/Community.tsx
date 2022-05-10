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
    ViewContainer,
    toast
} from '@impact-market/ui';

import { useGetCommunityMutation, useUpdateReviewMutation } from '../api/community';
import String from '../libs/Prismic/components/String';


const Community: React.FC<{ isLoading?: boolean; communityData: any }> = (props) => {
    const { communityData, isLoading } = props;
    const router = useRouter()

    const [communityId] = useState(communityData.id);
    const [community, setCommunity]= useState(communityData) as any;

    console.log(communityData)

    const [loading, setLoading] = useState(false);

    //  Review has 4 states: 'pending', 'accepted', 'claimed', 'declined'

    const [updateReview] = useUpdateReviewMutation();
    const [getCommunity] = useGetCommunityMutation();

    //  Get community data on first render
    // useEffect(() => {
    //     const init = async () => {
    //         try {
    //             setLoading(true);

    //             const community: any = await getCommunity(communityId);

    //             setCommunity(community.data);

    //             setLoading(false);
    //         } catch (error) {
    //             console.log(error);

    //             return false;
    //         }
    //     };

    //     init();
    // }, []);

    //  Update community review state and get new data
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

            //  Todo: text for toasters
            toast.success('Successfully changed community review state!');

            //  Send to /requests if community was declined
            review === 'declined' && router.push('/requests')

        } catch (error) {
            console.log(error);

            //  Todo: text for toasters
            toast.error('Please try again later.');

            return false;
        }
    };

    return (
        <ViewContainer isLoading={loading || isLoading}>
                    <Box as="a" mb={1.5} onClick={() => router.back()}>    
                        
                            <Label
                                content="Back"
                                icon="arrowLeft"
                            />
                        
                    </Box>
                    
                    {!!Object.keys(community).length &&
                    <>
                        <Grid cols={2}>
                            <Box left>
                                <Display>{community.name}</Display>
                                <Box inlineFlex mt={0.25}>
                                    {!!community?.country &&
                                        <CountryFlag
                                            countryCode={community?.country}
                                            mr={0.5}
                                        />
                                    }
                                    
                                    <Text extrasmall g500 medium>
                                        {community.city}
                                    </Text>
                                </Box>
                            </Box>

                            <Box right>
                                {(community.review === 'pending' || community.review === 'declined') && (
                                    <Box>
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
                                    <Box inlineFlex> 
                                        {/* Todo: edit details */}
                                        <Button>
                                            <Icon
                                                icon="edit"
                                                margin="0 0.5 0 0"
                                                n01
                                            />
                                            <String id="editDetails"/>
                                        </Button>
                                        
                                        {community.review !== 'accepted' && (
                                            <Box ml={1}>
                                                <DropdownMenu
                                                    asButton
                                                    items={[
                                                        {
                                                            icon: 'eye',
                                                            onClick: () => functionUpdateReview('accepted'),
                                                            title: 'Accept community'
                                                        }
                                                    ]}
                                                    rtl
                                                    title={<String id="actions"/>}
                                                />  
                                            </Box>  
                                        )}                                     
                                    </Box>
                                )}
                            </Box>

                            
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
                                    <String id="claimPerBeneficiary"/>
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
                            <Card>
                                <Text g500 mb={0.3} regular small>
                                    {/* <String id="timeIncrement"/> */}
                                    Tranche (Min./Max.)
                                </Text>
                                <Grid cols={2}>
                                    <Text g900 medium semibold>
                                        -
                                    </Text>
                                    <Box right>
                                        <PulseIcon
                                            bgS100
                                            borderColor="s50"
                                            icon="coins"
                                            s600
                                            size={2}
                                        />
                                    </Box>
                                </Grid>                       
                            </Card>
                        </Grid>   
                    </>
                }
        </ViewContainer>
    );
};

export default Community;
