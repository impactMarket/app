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
import Image from '../../components/Image'

import String from '../../libs/Prismic/components/String';


const Communities = ({ communities } : any) => {  

    return (
        <Grid colSpan={1.5} cols={{ lg: 4, sm: 2, xs: 1 }}>
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
                                    <Box h={12.5} radius={0.5} style={{position: 'relative'}} w="100%">
                                        <Image alt=""  src={community?.coverMediaPath} style={{borderRadius: '8px'}}/>
                                    </Box>
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
                                    <Box fLayout="center start" inlineFlex mr={1}>
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
                                            {community.state ? community.state.beneficiaries : 0}
                                        </Text>
                                    </Box>
                                    <Box fLayout="center start" inlineFlex>
                                        <Box inlineFlex mr={0.3}>
                                            <CountryFlag
                                                countryCode={community.country}
                                                height={1}
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
