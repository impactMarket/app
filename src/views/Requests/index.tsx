/* eslint-disable no-nested-ternary */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Display, ViewContainer } from '@impact-market/ui';

import { useGetCommunitiesMutation } from '../../api/community';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Filters from './Filters';
import ReviewTabs from './ReviewTabs';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import useCommunitiesReviewsByCountry from '../../hooks/useCommunitiesReviewsByCountry';
import useFilters from '../../hooks/useFilters';

const itemsPerPage = 8;

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { getByKey } = useFilters();
    const { asPath } = useRouter();

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [reviews] = useState(['pending', 'claimed', 'declined']);

    const [loadingCommunities, setLoadingCommunities] = useState(false);

    const [communities, setCommunities] = useState({}) as any;
    const [review, setReview] = useState(getByKey('review') || 'pending');

    const [getCommunities] = useGetCommunitiesMutation();

    // Pagination
    const [itemOffset, setItemOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageCount = Math.ceil(communities?.data?.count / itemsPerPage);

    const search = getByKey('search') || null;
    const country = getByKey('country') || (null as any);

    //  Communities
    useEffect(() => {
        const communities = async () => {
            try {
                setLoadingCommunities(true);

                const communities = await getCommunities({
                    country,
                    limit: itemsPerPage,
                    offset: itemOffset,
                    orderBy: 'updated:DESC',
                    review:
                        review === 'all'
                            ? reviews.map((review) => review)
                            : review,
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
    }, [review, itemOffset, asPath]);

    //  Filter countries and tabs numbers
    const { data: reviewsByCountryCount, loadingCountries: numbersLoading } =
        useCommunitiesReviewsByCountry('pending', fetcher);

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        if (event.selected >= 0) {
            const newOffset =
                (event.selected * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(event.selected);
        } else if (direction === 1 && currentPage > 0) {
            const newPage = currentPage - 1;
            const newOffset =
                (newPage * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        } else if (direction === 2 && currentPage < pageCount - 1) {
            const newPage = currentPage + 1;
            const newOffset =
                (newPage * itemsPerPage) % communities?.data?.count;

            setItemOffset(newOffset);
            setCurrentPage(newPage);
        }
    };

    return (
        <ViewContainer isLoading={isLoading || numbersLoading}>
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} />
            <Filters status="pending" />
            <ReviewTabs
                communities={communities}
                currentPage={currentPage}
                handlePageClick={handlePageClick}
                loading={loadingCommunities}
                pageCount={pageCount}
                reviewsCount={reviewsByCountryCount}
                setReview={setReview}
            />
        </ViewContainer>
    );
};

export default Requests;
