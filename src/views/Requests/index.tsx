import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Display,
    Grid,
    Text,
    ViewContainer,
    Icon,
    Tabs,
    TabList,
    Tab,
    TabPanel
} from '@impact-market/ui';
import RichText from '../../libs/Prismic/components/RichText';
import Link from 'next/link';
// import { useGetCommunitiesMutation } from '../api/community';

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const [communities, setCommunities] = useState({}) as any;
    const [myCountry, setMyCountry] = useState(true);
    //const [reviewStatus, setReviewStatus] = useState('')
    //const [getCommunities] = useGetCommunitiesMutation();
    

    // USING FETCH TEMPORARLY BECAUSE COMMUNITIES AREN'T ACCESSIBLE WITH TOKEN USING MUTATION
    // TODO -> USE MUTATION
        useEffect(() => {
            const init = async () => {
                const response = await fetch(
                    `https://impactmarket-api-staging.herokuapp.com/api/v2/communities?limit=999${
                        myCountry && '&country=PT'
                    }`,
                    { method: 'GET' }
                );

                setCommunities((await response.json()).data.rows);
            };

            init();
        }, [myCountry]);
    // -----

    console.log(communities)

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>Community Requests</Display>
            <Text g500 mt={0.25}>
                <RichText
                    content={
                        'Here you will find all the communities that have requested to join impactMarket.'
                    }
                />
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
                    <Tab number={3} title="Pending" />
                    <Tab title="Claim" />
                    <Tab number={50} title="Declined" />
                </TabList>
                <TabPanel>Content for Tab 1</TabPanel>
                <TabPanel>Content for Tab 2</TabPanel>
                <TabPanel>Content for Tab 3</TabPanel>
            </Tabs>
            <Grid cols={4} colSpan={1.5}>
                {communities.length > 0 &&
                    communities.map((community: any, key: number) => (
                        <Link href={'/requests/' + community.id} key={key}>
                            <Card>
                                <Box>
                                    <img
                                        src={community.coverImage}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                                <Text base semibold g900 margin={'0.7 0'}>
                                    {community.name}
                                    {community.review}
                                </Text>
                                <Box>
                                    <Box inlineFlex>
                                        <Icon mr={0.5} icon="users" g500 />
                                        <Text small regular g500>
                                            {community.state.beneficiaries}
                                        </Text>
                                    </Box>
                                    <Box inlineFlex>
                                        <Box mr={0.5}>{community.country}</Box>
                                        <Text small regular g500>
                                            {community.city}
                                        </Text>
                                    </Box>
                                </Box>
                            </Card>
                        </Link>
                    ))}
            </Grid>
        </ViewContainer>
    );
};

export default Requests;
