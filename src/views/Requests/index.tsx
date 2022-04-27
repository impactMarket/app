import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
    Box,
    Card,
    CountryFlag,
    Display,
    Grid,
    Icon,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    Tabs,
    Text,
    ViewContainer
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
                    myCountry,
                    review
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

    // console.log(communities);

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
                        onClick={() => setMyCountry(true)}
                        title="My Country"
                    />
                    <Tab
                        onClick={() => setMyCountry(false)}
                        title="Other Countries"
                    />
                </TabList>
            </Tabs>

            <Tabs>
                <TabList>
                    {reviews.map((review, key) => (
                        <Tab
                            key={key}
                            number={!!Object.keys(communities).length && communities.data.count}
                            onClick={() => setReview(review)}
                            title={review}
                        />
                    ))}
                </TabList>

                {!!Object.keys(communities).length &&
                    reviews.map((key) => (
                        <TabPanel key={key}>
                            {loading ? (
                                <Spinner isActive />
                            ) : (
                                <Grid colSpan={1.5} cols={4}>
                                    {communities.data.rows.map(
                                        (community: any, key: number) => (
                                            <Link
                                                href={`/requests/${community.id}`}
                                                key={key}
                                                passHref
                                            >
                                                <Card>
                                                    <Box>
                                                        {// eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            alt=""
                                                            src={ community.coverImage }
                                                            style={{
                                                                height: '200px',
                                                                objectFit: 'cover',
                                                                width: '100%',
                                                            }}
                                                        />
                                                        }
                                                    </Box>
                                                    <Text base g900 margin="0.7 0" semibold>
                                                        {community.name}
                                                    </Text>
                                                    <Box>
                                                        <Box inlineFlex mr={1}>
                                                            <Icon g500 icon="users" mr={0.5}/>
                                                            <Text g500 regular small>
                                                                { community.state ? community.state.beneficiaries : '-' } 
                                                            </Text>
                                                        </Box>
                                                        <Box inlineFlex>
                                                            <Box mr={0.1}>
                                                                <CountryFlag
                                                                    countryCode={community.country}
                                                                    size={[1.5, 1.5]}
                                                                />
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
