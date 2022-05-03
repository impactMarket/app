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

import { useGetCommunitiesMutation} from '../api/community';
import { useGetUserMutation } from '../api/user';

import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    //  Review has 4 states: 'pending', 'accepted', 'claimed', 'declined'

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [myCountrySelected, setMyCountrySelected] = useState(true);
    const [review, setReview] = useState('pending');
    const [reviews] = useState(['pending', 'accepted', 'claimed', 'declined']);

    const [getCommunities] = useGetCommunitiesMutation();
    const [getUser] = useGetUserMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);
                
                const user: any = await getUser();

                const communities = await getCommunities({
                    country: myCountrySelected ? user?.data?.country : undefined,
                    review
                });

                setCommunities(communities);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [myCountrySelected, review]);


    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} />

            <Tabs>
                <TabList>
                    <Tab
                        onClick={() => setMyCountrySelected(true)}
                        title={<String id="myCountry" />}
                    />
                    <Tab
                        onClick={() => setMyCountrySelected(false)}
                        title={<String id="otherCountries" />}
                    />
                </TabList>
            </Tabs>

            <Tabs>
                <TabList>
                    {reviews.map((review, key) => (
                        <Tab
                            key={key}
                            // Verify with Bernardo if numbers should be used in tabs:
                            // number={
                            //     !!Object.keys(communities).length &&
                            //     communities.data.count
                            // }
                            onClick={() => setReview(review)}
                            title={<String id={review} />}
                        />
                    ))}
                </TabList>

                {!!Object.keys(communities)?.length &&
                    reviews.map((key) => (
                        <TabPanel key={key}>
                            {loading ? (
                                <Spinner isActive />
                            ) : (
                                <Grid colSpan={1.5} cols={{ sm: 4, xs: 2 }}>
                                    {communities.data.count === 0 ?
                                        <String id="noCommunities" />
                                    :
                                        communities.data.rows.map(
                                            (community: any, key: number) => (
                                                <Link
                                                    href={`/requests/${community.id}`}
                                                    key={key}
                                                    passHref
                                                >
                                                    <Card as="a">
                                                        <Box>
                                                            {
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    alt=""
                                                                    src={
                                                                        community.coverImage
                                                                    }
                                                                    style={{
                                                                        height:
                                                                            '200px',
                                                                        objectFit:
                                                                            'cover',
                                                                        width:
                                                                            '100%'
                                                                    }}
                                                                />
                                                            }
                                                        </Box>
                                                        <Text
                                                            g900
                                                            margin="0.7 0"
                                                            semibold
                                                            small
                                                        >
                                                            {community.name}
                                                        </Text>
                                                        <Box>
                                                            <Box inlineFlex mr={1}>
                                                                <Icon
                                                                    g500
                                                                    icon="users"
                                                                    mr={0.5}
                                                                />
                                                                <Text
                                                                    g500
                                                                    regular
                                                                    small
                                                                >
                                                                    {community.state
                                                                        ? community
                                                                            .state
                                                                            .beneficiaries
                                                                        : '-'}
                                                                </Text>
                                                            </Box>
                                                            <Box inlineFlex>
                                                                <Box mr={0.1}>
                                                                    <CountryFlag
                                                                        countryCode={
                                                                            community.country
                                                                        }
                                                                        size={[
                                                                            1.5,
                                                                            1.5
                                                                        ]}
                                                                    />
                                                                </Box>
                                                                <Text
                                                                    g500
                                                                    regular
                                                                    small
                                                                >
                                                                    {community.city}
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                    </Card>
                                                </Link>
                                            )
                                        )
                                    }
                                    
                                </Grid>
                            )}
                        </TabPanel>
                    ))}
            </Tabs>
        </ViewContainer>
    );
};

export default Requests;
