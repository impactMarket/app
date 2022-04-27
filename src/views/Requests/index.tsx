import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
    Box,
    Card,
    Display,
    Grid,
    Icon,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Text,
    ViewContainer,
    Spinner
} from '@impact-market/ui';

import { useGetCommunitiesMutation } from '../../api/community';

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    //  REVIEW HAS 4 STATES: 'pending', 'accepted', 'claimed', 'declined'

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [myCountry, setMyCountry] = useState(true);
    const [review, setReview] = useState('pending');
    const [reviews] = useState(['pending', 'accepted', 'claimed', 'declined']);

    const [getCommunities] = useGetCommunitiesMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                const communities = await getCommunities({
                    myCountry: myCountry,
                    review: review
                });
                setLoading(false);
                setCommunities(communities);
            } catch (error) {
                console.log(error);
                return false;
            }
        };

        init();
    }, [myCountry, review]);

    console.log(communities);

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>Community Requests</Display>
            <Text g500 mt={0.25}>
                Here you will find all the communities that have requested to
                join impactMarket.
            </Text>

            <Tabs>
                <TabList>
                    <Tab
                        title="My Country"
                        onClick={() => setMyCountry(true)}
                    />
                    <Tab
                        title="Other Countries"
                        onClick={() => setMyCountry(false)}
                    />
                </TabList>
            </Tabs>

            <Tabs>
                <TabList>
                    {reviews.map((review) => (
                        <Tab
                            number={!!Object.keys(communities).length && communities.data.count}
                            title={review}
                            onClick={() => setReview(review)}
                        />
                    ))}
                </TabList>

                {!!Object.keys(communities).length &&
                    reviews.map(() => (
                        <TabPanel>
                            {loading ? (
                                <Spinner isActive />
                            ) : (
                                <Grid colSpan={1.5} cols={4}>
                                    {communities.data.rows.map(
                                        (community: any, key: number) => (
                                            <Link
                                                href={`/requests/${community.id}`}
                                                key={key}
                                            >
                                                <Card>
                                                    <Box>
                                                        <img
                                                            src={ community.coverImage }
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit:
                                                                    'cover'
                                                            }}
                                                        />
                                                    </Box>
                                                    <Text base g900 margin="0.7 0" semibold>
                                                        {community.name}
                                                    </Text>
                                                    <Box>
                                                        {community.state && (
                                                            <Box inlineFlex>
                                                                <Icon g500 icon="users" mr={0.5}/>
                                                                <Text g500 regular small>
                                                                    { community.state.beneficiaries }
                                                                </Text>
                                                            </Box>
                                                        )}
                                                        <Box inlineFlex>
                                                            <Box mr={0.5}>
                                                                { community.countryb}
                                                            </Box>
                                                            <Text g500 regular small>
                                                                {community.city}
                                                            </Text>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Link>
                                        )
                                    )}
                                </Grid>
                            )}
                        </TabPanel>
                    ))}
            </Tabs>
        </ViewContainer>
    );
};

export default Requests;
