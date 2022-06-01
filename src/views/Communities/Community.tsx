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
                        {community?.state?.beneficiaries || '-'}
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
);

export default Communities;
