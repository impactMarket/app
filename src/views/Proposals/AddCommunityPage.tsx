import { useGetPendingCommunitiesMutation } from '../../api/community';
import Community from './Community';
import React, { useEffect, useState } from 'react';

const AddCommunityPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [getPendingCommunities] = useGetPendingCommunitiesMutation();

    useEffect(() => {
        const getCommunities = async () => {
            try {
                setIsLoading(true);
                const response = await getPendingCommunities().unwrap();
    
                console.log(response);
    
                setCommunities(response?.rows || []);
                setIsLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            };      
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
            <ul style={{ marginTop: 32 }}>
                {communities.map((community, index) => (
                    <Community key={index} {...community} />
                   
                ))}
            </ul>
        </div>
    );
};

export default AddCommunityPage;
