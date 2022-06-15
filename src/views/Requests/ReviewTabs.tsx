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

import Communities from './Communities'
import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';

const ReviewTabs = ({ communities, loading, allCountries, otherCountries, myCountrySelected, userCountry, setReview, currentPage, handlePageClick, pageCount } : any) => {  
    const { update, getByKey } = useFilters();
    
    //  Review has 4 states: 'pending', 'accepted', 'claimed', 'declined'
    const [reviews] = useState(['pending', 'claimed', 'declined']);

    //  Get how many communties there are in each review - My Country
    const myCountryCommunities = (review: any) => {
        let myCountryNumberOfReviews = {} as any

        !!Object.keys(allCountries).length && (
            allCountries.filter((countryName: any) => 
                userCountry === countryName?.country).map((quantity: any) => (
                    myCountryNumberOfReviews = quantity
                )) 
        )
        
        return isNaN(parseInt(myCountryNumberOfReviews[review], 10)) ? 0 : parseInt(myCountryNumberOfReviews[review], 10)
    }

    //  Get how many communties there are in each review (pending, claimed, declined) - Other Countries
    const otherCountriesCommunities = (review: any) => {
        const otherCountriesNumberOfReviews = [] as any
        
        !!Object.keys(otherCountries).length && (
            otherCountries.map((country: any) => (
                    otherCountriesNumberOfReviews.push(parseInt(country?.[review], 10))
                )) 
        )
        
        return otherCountriesNumberOfReviews.reduce((a: any, b: any) => a + b, 0)
    }


    return (
            <Tabs 
                defaultIndex={
                    // eslint-disable-next-line no-nested-ternary
                    getByKey('review') === 'pending' ? 0 : 
                    getByKey('review') === 'claimed' ? 1 : 
                    getByKey('review') === 'declined' && 2
            }>
                <TabList>
                    {reviews.map((review, key) => (
                        <Tab
                            key={key}
                            number={
                                !!myCountrySelected ?
                                    myCountryCommunities(review)
                                :
                                    otherCountriesCommunities(review)
                                }
                            onClick={() => {setReview(review); update('review', review)}}
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
                                    <Communities
                                        communities={communities}
                                    />
                                    <Pagination
                                        currentPage={currentPage}
                                        handlePageClick={handlePageClick}
                                        mt={2}
                                        nextIcon="arrowRight"
                                        nextLabel="Next"
                                        pageCount={pageCount}
                                        previousIcon="arrowLeft"
                                        previousLabel="Previous"
                                    />
                                </>
                            )}
                        </TabPanel>
                    ))
                }
            </Tabs>
    );
};

export default ReviewTabs;
