/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation, useGetReviewsByCountryMutation } from '../../api/community';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import CountryTabs from './CountryTabs';
import Filters from '../../components/Filters';
import ReviewTabs from './ReviewTabs';
import RichText from '../../libs/Prismic/components/RichText';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 8;

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const { asPath } = useRouter();

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loadingCommunities, setLoadingCommunities] = useState(false);
    const [numbersLoading, setNumbersLoading] = useState(false);

    const [communities, setCommunities] = useState({}) as any;
    const [myCountrySelected, setMyCountrySelected] = useState(
        getByKey('country') === 'mycountry' ? true :
        getByKey('country') !== 'othercountries'
    );
    const [review, setReview] = useState(
        getByKey('review') || 'pending'
    );
    
    const [userCountry] = useState(user?.country) as any
    const [allCountries, setAllCountries] = useState({}) as any
    const [otherCountries, setOtherCountries] = useState({}) as any

    const [getCommunities] = useGetCommunitiesMutation();
    const [getReviewsByCountry] = useGetReviewsByCountryMutation()

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(communities?.data?.count / itemsPerPage);

    const search = getByKey('search') || null;

    //  Communities
    useEffect(() => {
        const communities = async () => {
            const userCountry = user?.country?.toUpperCase() || 0;

            try {
                setLoadingCommunities(true);

                const communities = await getCommunities({
                    country: myCountrySelected ? userCountry : undefined,
                    excludeCountry: myCountrySelected ? undefined : userCountry,
                    limit: itemsPerPage,
                    offset: itemOffset,
                    orderBy: 'updated:DESC',
                    review,
                    search
                });

                setCommunities(communities);

                setLoadingCommunities(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        communities();
    }, [myCountrySelected, review, itemOffset, asPath]);

    //  Tabs (countries and review) numbers
    useEffect(() => {
        const tabsNumber = async () => {
            try {
                setNumbersLoading(true)
                
                //  Number for tabs
                const allCountries = await getReviewsByCountry({
                    status: "pending",
                }).unwrap()
                const otherCountries = await getReviewsByCountry({
                    excludeCountry: userCountry,
                    status: "pending"
                }).unwrap()

                setAllCountries(allCountries)
                setOtherCountries(otherCountries)

                setNumbersLoading(false)
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        tabsNumber();
    }, []);

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
        <ViewContainer isLoading={isLoading|| numbersLoading}>
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} />
            <CountryTabs 
                allCountries={allCountries}
                otherCountries={otherCountries}
                setMyCountrySelected={setMyCountrySelected}
                userCountry={userCountry}
            />
            <Filters margin="1.5 0 0 0" maxW={20} property="search" />
            <ReviewTabs
                allCountries={allCountries}
                communities={communities}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
                loading={loadingCommunities}
                myCountrySelected={myCountrySelected}
                otherCountries={otherCountries}
                pageCount={pageCount}
                setReview={setReview}
                userCountry={userCountry}
            />
        </ViewContainer>
    );
};

export default Requests;
