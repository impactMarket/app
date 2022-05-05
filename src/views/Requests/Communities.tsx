import Link from 'next/link';
import React from 'react';

import {
    Box,
    Card,
    CountryFlag,
    Grid,
    Icon,
    Text
} from '@impact-market/ui';
import { getImage } from '../../utils/images';

import String from '../../libs/Prismic/components/String';

const Communities = ({ communities } : any) => {   

    //  Get image 
    const getMedia = (filePath: string) =>
        getImage({
            filePath,
            fit: 'cover',
            height: 0,
            width: 0
        });


    return (
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
                                            {community.state ? community.state.beneficiaries : '-'}
                                        </Text>
                                    </Box>
                                    <Box inlineFlex>
                                        <Box mr={0.3}>
                                            <CountryFlag
                                                countryCode={community.country}
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
    )
};

export default Communities;
