import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';

import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import TabList from './Tabs'


const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [supportingCommunities, setSupportingCommunities] = useState({}) as any;

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

                const totalValidCommunities = await getCommunities({
                    ambassadorAddress: user?.address,
                    status: 'valid'
                });

                setCommunities(communities);
                setSupportingCommunities(totalValidCommunities)

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [activeTab, statusFilter]);


    //  Get how many countries the ambassador is suporting
    const supportingCountries = () => {
        const supportingCountries = [] as any

        supportingCommunities?.data?.rows.map((community: any) => {
            supportingCountries.push(community?.country)
        })

        const deleteDuplicatedCountries = [...new Set(supportingCountries)];

        return deleteDuplicatedCountries.length
    }
    

    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                {title}
            </Display>   
            {(user?.roles.includes('ambassador') && activeTab === 'myCommunities') ?
                <RichText content={content} g500 mt={0.25} variables = {{ communities: supportingCommunities?.data?.count, countries: supportingCountries() }} /> 
            :
                <Message 
                    g500
                    id="communitiesJoined" 
                    mt={0.25}
                />
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
