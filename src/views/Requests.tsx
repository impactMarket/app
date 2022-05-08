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

import { useGetCommunitiesMutation, useGetReviewsByCountryMutation, useGetReviewsCountMutation } from '../api/community';
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
    
    const [userCountry, setUserCountry] = useState() as any
    const [numberOfCommunitiesByReview, setNumberOfCommunitiesByReview] = useState({}) as any
    const [reviewsByCountry, setReviewsByCountry] = useState({}) as any

    const [getCommunities] = useGetCommunitiesMutation();
    const [getReviewsByCountry] = useGetReviewsByCountryMutation()
    const [getReviewsCount] = useGetReviewsCountMutation()
    const [getUser] = useGetUserMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const user: any = await getUser();
                const communities = await getCommunities({
                    // eslint-disable-next-line no-nested-ternary
                    country: myCountrySelected ? (user?.data?.country === null ? 0 : user?.data?.country) : undefined,
                    review
                });
                const reviews = await getReviewsCount().unwrap()
                const reviewsByCountry = await getReviewsByCountry().unwrap()

                setCommunities(communities);
                setUserCountry(user?.data?.country)
                setNumberOfCommunitiesByReview(reviews)
                setReviewsByCountry(reviewsByCountry)

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [myCountrySelected, review]);

    //  #region - Get how many communities there are in "other countries" / "mycountry" tabs
    const myCountryNumberOfCommunities = () => {
        let numberOfCommunities = 0

        !!Object.keys(reviewsByCountry).length && (
            reviewsByCountry.filter((countryName: any) => countryName.country === userCountry).map((country: any) => {
                numberOfCommunities = country.count
            }
        ))

        return numberOfCommunities
    }

    const otherCountriesNumberOfCommunities = () => {
        const numberOfCommunitiesArray = [] as any

        !!Object.keys(reviewsByCountry).length && (
            reviewsByCountry.map((country: any) => (
                numberOfCommunitiesArray.push(parseInt(country.count, 10))
            ))
        )

        return numberOfCommunitiesArray.reduce((a: number, b: number) => a + b, 0)
    }
    // #endregion


    // Get how many communties there are in each review (pending, accepted, claimed, declined)
    const numberOfEachReview = (review: any) => {
        let otherCountriesNumberOfReviews = 0
        let myCountryNumberOfReviews = {} as any

        !!myCountrySelected ?
            !!Object.keys(reviewsByCountry).length && (
                reviewsByCountry.filter((communitiesNumber: any) => 
                    userCountry === communitiesNumber?.country).map((quantity: any) => (
                        myCountryNumberOfReviews = quantity
                    )) 
            )
        :
            !!Object.keys(numberOfCommunitiesByReview).length && (
                numberOfCommunitiesByReview.filter((reviewName: any) => reviewName.review === review).map((count: any) => (
                    otherCountriesNumberOfReviews = count.count
                ))
            )

        return !!myCountrySelected ? myCountryNumberOfReviews[review] : otherCountriesNumberOfReviews
    }

    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} />

            <Tabs>
                <TabList>
                    <Tab
                        number={myCountryNumberOfCommunities()}
                        onClick={() => setMyCountrySelected(true)}
                        title={<String id="myCountry" />}
                    />
                    <Tab
                        number={otherCountriesNumberOfCommunities()}
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
                            number={numberOfEachReview(review)}
                            onClick={() => setReview(review)}
                            title={<String id={review} />}
                        />
                    ))}
                </TabList>

                {!!Object.keys(communities).length &&
                    reviews.map((key) => (
                        <TabPanel key={key}>
                            {loading ? (
                                <Spinner isActive />
                            ) : (
                                <Grid colSpan={1.5} cols={{ sm: 4, xs: 1 }}>
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
                                                                    src={community.coverImage}
                                                                    style={{
                                                                        height: '200px',
                                                                        objectFit: 'cover',
                                                                        width: '100%'
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
                                                                    {community.state ? community.state.beneficiaries : '-'}
                                                                </Text>
                                                            </Box>
                                                            <Box inlineFlex>
                                                                <Box mr={0.1}>
                                                                    <CountryFlag
                                                                        countryCode={community.country}
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
