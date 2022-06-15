/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';

import { useRouter } from 'next/router';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import TabList from './Tabs';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 10;

const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const router = useRouter();

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [supportingCommunities, setSupportingCommunities] = useState({}) as any;

    const [activeTab, setActiveTab] = useState(
        getByKey('type') === 'all' ? 'all' :
        getByKey('type') === 'mycommunities' ? 'myCommunities' : 'all'
    );
    const [statusFilter, setStatusFilter] = useState(getByKey('state') || 'valid');

    const [communitiesTabs] = useState(['all', 'myCommunities']);

    const [getCommunities] = useGetCommunitiesMutation();

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(communities?.data?.count / itemsPerPage);


    useEffect(() => {
        if(!getByKey('type')) {
            router.push('/communities?type=all', undefined, { shallow: true });
        }

        if((getByKey('type') === 'mycommunities') && (!user?.roles.includes('ambassador'))) {
            router.push('/communities?type=all', undefined, { shallow: true });
        }

        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    ambassadorAddress: activeTab === 'all' ? undefined : user?.address,
                    limit: itemsPerPage,
                    offset: itemOffset,
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
    }, [activeTab, statusFilter, itemOffset]);


    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {        
        if (event.selected >= 0) {
            const newOffset = (event.selected * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset = (newPage * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset = (newPage * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        }
    };


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
                !loading && <RichText content={content} g500 mt={0.25} variables = {{ communities: supportingCommunities?.data?.count, countries: supportingCountries() }} /> 
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
                currentPage={currentPage}
                handlePageClick={handlePageClick}
                loading={loading}
                pageCount={pageCount}
                setActiveTab={setActiveTab}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                user={user}
            />
        </ViewContainer>
    );
};

export default Communities;
