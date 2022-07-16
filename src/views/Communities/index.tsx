/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetAllClaimsLocationsMutation, useGetCommunitiesMutation, useGetCountryByCommunitiesMutation } from '../../api/community';

import { getCountryNameFromInitials } from '../../utils/countries';
import { useRouter } from 'next/router';
import Content from './Content';
import Header from './Header'
import useFilters from '../../hooks/useFilters';

interface CountriesList {
    label: string;
    value: string;
}

const itemsPerPage = 8;

const Communities: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const { asPath } = useRouter();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [supportingCommunities, setSupportingCommunities] = useState({}) as any;
    const [communitiesCountries, setCommunitiesCountries] = useState<CountriesList[]>([]);
    const [claimsLocations, setClaimsLocations] = useState([]) as any;

    const [activeTab, setActiveTab] = useState(
        getByKey('type') === 'all' ? 'all' :
        getByKey('type') === 'myCommunities' ? 'myCommunities' : 'all'
    );
    const [statusFilter, setStatusFilter] = useState(getByKey('state') || 'valid');

    const [communitiesTabs] = useState(['all', 'myCommunities']);

    const [getCommunities] = useGetCommunitiesMutation();
    const [getCountryByCommunities] = useGetCountryByCommunitiesMutation();
    const [getAllClaimsLocations] = useGetAllClaimsLocationsMutation();

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(communities?.data?.count / itemsPerPage);

    const name = getByKey('name') || null;
    const countries = getByKey('country') || null;

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
                    country: countries,
                    limit: itemsPerPage,
                    name,
                    offset: itemOffset,
                    orderBy: 'bigger:DESC',
                    status: activeTab === 'myCommunities' ? statusFilter : 'valid'
                });

                const totalValidCommunities = await getCommunities({
                    ambassadorAddress: user?.address,
                    status: 'valid'
                });

                const communitiesCountries = await getCountryByCommunities().unwrap();

                const communitiesCountriesArray = communitiesCountries.map((data) => ({
                    label: getCountryNameFromInitials(data.country),
                    value: data.country
                }));

                const claimsLocations = await getAllClaimsLocations().unwrap()

                mapArray(claimsLocations)
                setCommunities(communities);
                setSupportingCommunities(totalValidCommunities)
                setCommunitiesCountries([...communitiesCountriesArray]);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [activeTab, statusFilter, itemOffset, asPath]); 
    
    //  Create an array with all the locations
    const mapArray = (claimsLocations: any) => {
        const claimsArray: any[] = [];

        claimsLocations?.map((location: { gps: any; }) => claimsArray.push(location.gps))

        setClaimsLocations(claimsArray)
    }

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
            <Content
                activeTab={activeTab}
                claimsLocations={claimsLocations}
                communities={communities}
                communitiesTabs={communitiesTabs}
                currentPage={currentPage}
                filtersCommunityCountries={communitiesCountries}
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
