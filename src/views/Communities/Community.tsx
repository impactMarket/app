import Link from 'next/link';
import React from 'react';

import {
    Box,
    Card,
    CountryFlag,
    Icon,
    Text,
} from '@impact-market/ui';

import Image from '../../components/Image'


const Communities = ({ community }: any) => (
    <Link
        href={`/communities/${community.id}`}
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
                        mr={0.3}
                    />
                    <Text
                        g500
                        regular
                        small
                    >
                        {community?.state?.beneficiaries || 0}
                    </Text>
                </Box>
                <Box fLayout="center start" inlineFlex>
                    <Box inlineFlex mr={0.3}>
                        <CountryFlag
                            countryCode={
                                community.country
                            }
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
);

export default Communities;
