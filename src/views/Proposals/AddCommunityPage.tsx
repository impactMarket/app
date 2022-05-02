import { useGetPendingCommunitiesMutation } from '../../api/community';
// import Community from './Community';
import React, { useEffect, useState } from 'react';

const AddCommunityPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();

    useEffect(() => {
        const getCommunities = async () => {
            setIsLoading(true);
            const response = await getPendingCommunities().unwrap();
            // const response = await impactMarket.getPendingCommunities();

            console.log(response);

            setCommunities(response);
            // setCommunities(response?.data.rows || []);
            setIsLoading(false);
        };

        getCommunities();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!communities && !isLoading) {
        return (
            <div>
                <h3>No communities</h3>
            </div>
        );
    }

    return (
        <div>
            <h3>Add Community</h3>
            <h4>Communities</h4>
            <ul style={{ marginTop: 32 }}>
                {communities.map((community, index) => (
                    // <Community key={index} {...community} />
                    <div key={index} />
                ))}
            </ul>
        </div>
    );
};

export default AddCommunityPage;
