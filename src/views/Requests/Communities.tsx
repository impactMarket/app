import React from 'react';

import { Grid } from '@impact-market/ui';
import CommunityCard from '../../components/CommunityCard';

import String from '../../libs/Prismic/components/String';

const Communities = ({ communities }: any) => (
    <Grid {...({} as any)} colSpan={1.5} cols={{ lg: 4, sm: 2, xs: 1 }}>
        {communities?.data?.count === 0 ? (
            <String id="noCommunities" />
        ) : (
            communities?.data?.rows?.map((community: any, key: number) => (
                <CommunityCard community={community} key={key} />
            ))
        )}
    </Grid>
);

export default Communities;
