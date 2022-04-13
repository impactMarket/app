import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    ViewContainer
} from '@impact-market/ui';

const Community: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    
    // GET ID FROM COMMUNITY FROM URL (DYNAMIC ROUTE)
    const router = useRouter()
    const { id } = router.query

    const [community, setCommunity] = useState({}) as any;

    // USING FETCH TEMPORARLY BECAUSE COMMUNITIES AREN'T ACCESSIBLE WITH TOKEN USING MUTATION
    // TODO -> USE MUTATION
    useEffect(() => {
        const init = async () => {
            const response = await fetch(
                `https://impactmarket-api-staging.herokuapp.com/api/v2/communities?limit=999&id=${id}`, { method: 'GET' }
            );

            setCommunity((await response.json()).data.rows);
        };

        init();
    }, []);
    // ---

    console.log(community)

    return (
        <ViewContainer isLoading={isLoading}>
            <p>test</p>
        </ViewContainer>
    );
};

export default Community;