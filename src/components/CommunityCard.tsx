import {
    Box,
    Card,
    Icon,
    Text,
} from '@impact-market/ui';
import { getCountryNameFromInitials } from '../utils/countries';
import Image from './Image'
import Link from 'next/link';
import React from 'react';
import ShimmerEffect from '../components/ShimmerEffect';
import styled from 'styled-components';

const TextWrapper = styled.div`
    p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 2rem;
        line-height: 1rem;
    } 
`;

const CommunityCard = ({ community, isLoading }: any) => (
    <Link
        href={`/communities/${community.id}`}
        passHref
    >
        <Card as="a">
            <Box h={12.5} radius={0.5} style={{position: 'relative'}} w="100%">
                <ShimmerEffect isLoading={isLoading}>
                    <Image alt="" h={300}  src={community?.coverMediaPath} style={{borderRadius: '8px'}} w={300} />
                </ShimmerEffect>
            </Box>
            <TextWrapper>
                <ShimmerEffect isLoading={isLoading} style={{height: '21.5px', marginTop: '10px', width: '90%'}}>
                    <Text
                        g900
                        margin="0.7 0"
                        semibold
                        small
                    >
                        {community.name}
                    </Text>
                </ShimmerEffect>
            </TextWrapper>       
            <Box fLayout="center start">
                <ShimmerEffect isLoading={isLoading} style={{height: '21.5px', marginTop: '10px', width: '60%'}}>
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
                        <Box margin="0 0.3 0 0.3">
                            &middot;
                        </Box>
                        <Text
                            g500
                            regular
                            small
                        >
                            {getCountryNameFromInitials(community.country)}
                        </Text>
                    </Box>
                </ShimmerEffect>
            </Box>
        </Card>
    </Link>
);

export default CommunityCard;
