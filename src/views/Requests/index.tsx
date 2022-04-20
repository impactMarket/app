import Link from "next/link"
import React, { useEffect, useState } from "react"

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
  ViewContainer
} from "@impact-market/ui"

import { useGetCommunitiesByCountryMutation } from "../../api/community"

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const [communities, setCommunities] = useState({}) as any;
    const [myCountry, setMyCountry] = useState(true);
    //  const [reviewStatus, setReviewStatus] = useState('')
    const [getCommunities] = useGetCommunitiesByCountryMutation();

    useEffect(() => {
        const init = async () => {
            try {
                const communities = await getCommunities(myCountry as any);

                setCommunities(communities);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [myCountry]);

    console.log(communities)

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
                    <Tab number={3} title="Pending" />
                    <Tab title="Claim" />
                    <Tab number={50} title="Declined" />
                </TabList>
                <TabPanel>Content for Tab 1</TabPanel>
                <TabPanel>Content for Tab 2</TabPanel>
                <TabPanel>Content for Tab 3</TabPanel>
            </Tabs>
            <Grid colSpan={1.5} cols={4}>
                {Object.keys(communities).length > 0 &&
                    communities.data.rows.map((community: any, key: number) => (
                        <Link href={`/requests/${  community.id}`} key={key}>
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
                                <Text base g900 margin="0.7 0" semibold>
                                    {community.name}
                                    {community.review}
                                </Text>
                                <Box>
                                    <Box inlineFlex>
                                        <Icon g500 icon="users" mr={0.5} />
                                        <Text g500 regular small>
                                            {community.state.beneficiaries}
                                        </Text>
                                    </Box>
                                    <Box inlineFlex>
                                        <Box mr={0.5}>{community.country}</Box>
                                        <Text g500 regular small>
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
