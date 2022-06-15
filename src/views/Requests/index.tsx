/* eslint-disable no-nested-ternary */
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunitiesMutation, useGetReviewsByCountryMutation } from '../../api/community';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import CountryTabs from './CountryTabs'
import ReviewTabs from './ReviewTabs'
import RichText from '../../libs/Prismic/components/RichText';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 10;

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loading, setLoading] = useState(false);
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


    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    country: myCountrySelected ? (user?.country === null ? 0 : user?.country.toUpperCase()) : undefined,
                    excludeCountry: myCountrySelected ? undefined : (user?.country === null ? 0 : user?.country.toUpperCase()),
                    limit: itemsPerPage,
                    offset: itemOffset,        
                    review,
                });
                
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

                setCommunities(communities);

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [myCountrySelected, review, itemOffset]);


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
            <ReviewTabs 
                allCountries={allCountries}
                communities={communities}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
                loading={loading}
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
