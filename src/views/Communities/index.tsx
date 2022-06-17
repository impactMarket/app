/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation } from '../../api/community';

import { useRouter } from 'next/router';
import Header from './Header'
import TabList from './Tabs';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 8;

const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [supportingCommunities, setSupportingCommunities] = useState({}) as any;

    const [activeTab, setActiveTab] = useState(
        getByKey('type') === 'all' ? 'all' :
        getByKey('type') === 'myCommunities' ? 'myCommunities' : 'all'
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

        if((getByKey('type') === 'myCommunities') && (!user?.roles.includes('ambassador'))) {
            router.push('/communities?type=all', undefined, { shallow: true });
        }

        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    ambassadorAddress: activeTab === 'all' ? undefined : user?.address,
                    limit: itemsPerPage,
                    offset: itemOffset,
                    status: activeTab === 'myCommunities' ? statusFilter : 'valid'
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

    return (
        <ViewContainer isLoading={isLoading}>
            <Header
                activeTab={activeTab}
                loading={loading}
                supportingCommunities={supportingCommunities}
                user={user}
            />         
            <TabList
                activeTab={activeTab}
                communities={communities}
                communitiesTabs={communitiesTabs}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
                loading={loading}
                pageCount={pageCount}
                setActiveTab={setActiveTab}
                setItemOffset={setItemOffset}
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                user={user}
            />
        </ViewContainer>
    );
};

export default Communities;
