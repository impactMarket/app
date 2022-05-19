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
import { getImage } from '../utils/images';

import { useGetCommunitiesMutation } from '../api/community';

import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;

    const [reviews] = useState(['all', 'suspicious-activity', 'low-on-funds']);

    const [getCommunities] = useGetCommunitiesMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    country: undefined,
                    review: 'accepted'
                });

                setCommunities(communities);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, []);

    const getMedia = (filePath: string) =>
        getImage({
            filePath,
            fit: 'cover',
            height: 0,
            width: 0
        });


    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                My Communities
            </Display>
            <RichText content="You are currently supporting X communitites in X country." g500 mt={0.25} />            

            <Tabs>
                <TabList>
                    <Tab
                        title="All"
                    />
                    <Tab
                        title="Suspicious Activity"
                    />
                    <Tab
                        title="Low on Funds"
                    />
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
                                                    href={`/communities/${community.id}`}
                                                    key={key}
                                                    passHref
                                                >
                                                    <Card as="a">
                                                        {!!community?.coverMediaPath &&
                                                            <Box
                                                                bgImg={getMedia(community?.coverMediaPath)}
                                                                h={12.5}
                                                                radius={0.5}
                                                                w="100%"
                                                            />
                                                         }     
                                                        <Text
                                                            g900
                                                            margin="0.7 0"
                                                            semibold
                                                            small
                                                        >
                                                            {community.name}
                                                        </Text>
                                                        <Box fLayout="center start" inlineFlex>
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

export default Communities;
