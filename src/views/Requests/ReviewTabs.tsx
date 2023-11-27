/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import {
    Pagination,
    Row,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    Tabs
} from '@impact-market/ui';

import Communities from './Communities';
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';

const ReviewTabs = ({
    communities,
    loading,
    setReview,
    currentPage,
    handlePageClick,
    pageCount,
    reviewsCount
}: any) => {
    const { update, getByKey } = useFilters();

    const [reviews] = useState(['pending', 'claimed', 'declined', 'all']);

    const handleClickOnReviewFilter = (review: any) => {
        setReview(review);
        update('review', review);
    };

    const country = getByKey('country') || (null as any);
    const countries = country?.split(';');

    const countriesStateSum = {
        all: 0,
        claimed: 0,
        declined: 0,
        pending: 0
    } as any;

    const countryFilterTabsNumbers = () => {
        const selectedCountries = [] as any[];

        !!Object.keys(reviewsCount).length &&
            (!!countries?.length
                ? reviewsCount?.map(
                      (countryReview: any) =>
                          countries?.map(
                              (country: any) =>
                                  countryReview?.country === country &&
                                  selectedCountries?.push(countryReview)
                          )
                  )
                : reviewsCount?.map(
                      (data: any) => selectedCountries?.push(data)
                  ));

        selectedCountries?.map((country: any) => {
            countriesStateSum['claimed'] =
                countriesStateSum?.claimed + parseInt(country?.claimed, 10);
            countriesStateSum['declined'] =
                countriesStateSum?.declined + parseInt(country?.declined, 10);
            countriesStateSum['pending'] =
                countriesStateSum?.pending + parseInt(country?.pending, 10);
            countriesStateSum['all'] =
                countriesStateSum?.claimed +
                countriesStateSum?.declined +
                countriesStateSum?.pending;
        });
    };

    countryFilterTabsNumbers();

    return (
        <Tabs
            defaultIndex={
                getByKey('review') === 'pending'
                    ? 0
                    : getByKey('review') === 'claimed'
                      ? 1
                      : getByKey('review') === 'declined'
                        ? 2
                        : getByKey('review') === 'all' && 3
            }
        >
            <TabList>
                {reviews.map((review, key) => (
                    <Tab
                        key={key}
                        number={
                            !!Object.keys(countriesStateSum).length &&
                            countriesStateSum[review]
                        }
                        onClick={() => handleClickOnReviewFilter(review)}
                        title={<String id={review} />}
                    />
                ))}
            </TabList>

            {!!Object.keys(communities).length &&
                reviews.map((key) => (
                    <TabPanel key={key}>
                        {loading ? (
                            <Row fLayout="center" h="50vh" mt={2}>
                                <Spinner isActive />
                            </Row>
                        ) : (
                            <>
                                <Communities communities={communities} />
                                <Pagination
                                    currentPage={currentPage}
                                    handlePageClick={handlePageClick}
                                    mt={2}
                                    nextIcon="arrowRight"
                                    nextLabel="Next"
                                    pageCount={pageCount}
                                    pb={6}
                                    previousIcon="arrowLeft"
                                    previousLabel="Previous"
                                />
                            </>
                        )}
                    </TabPanel>
                ))}
        </Tabs>
    );
};

export default ReviewTabs;
