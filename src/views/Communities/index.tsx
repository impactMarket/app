import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';

import RichText from '../../libs/Prismic/components/RichText';
import TabList from './Tabs'


const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;

    const [activeTab, setActiveTab] = useState('all')
    const [statusFilter, setStatusFilter] = useState('valid')

    const [communitiesTabs] = useState(['all', 'myCommunities']);

    const [getCommunities] = useGetCommunitiesMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    ambassadorAddress: activeTab === 'all' ? undefined : user?.address,
                    review: activeTab === 'all' ? 'accepted' : undefined,
                    status: activeTab === 'myCommunities' ? statusFilter : undefined
                });

                setCommunities(communities);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [activeTab, statusFilter]);

    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                {title}
            </Display>   
            {(user?.roles.includes('ambassador') && activeTab === 'myCommunities') ?
                <RichText content={content} g500 mt={0.25} variables = {{ communities: communities?.data?.count, country: 'X' }} /> 
            :
                //  Todo: Add texts on Prismic
                <RichText content="Here you will find all the communities that joined impactMarket." g500 mt={0.25}/>
            }          
            <TabList
                activeTab={activeTab}
                communities={communities}
                communitiesTabs={communitiesTabs}
                loading={loading}
                setActiveTab={setActiveTab}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
            />
        </ViewContainer>
    );
};

export default Communities;
