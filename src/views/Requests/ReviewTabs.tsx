import React, { useState } from 'react';

import {
    Spinner,
    Tab,
    TabList,
    TabPanel,
    Tabs
} from '@impact-market/ui';

import Communities from './Communities'
import String from '../../libs/Prismic/components/String';

const ReviewTabs = ({ communities, loading, allCountries, otherCountries, myCountrySelected, userCountry, setReview } : any) => {  
    
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
            <Tabs>
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
                            onClick={() => setReview(review)}
                            title={<String id={review} />}
                        />
                    ))}
                </TabList>

                {!!Object.keys(communities).length &&
                    reviews.map((key) => (
                        <TabPanel key={key}>
                            {loading ? (
                                <Spinner isActive />
                            ) : (
                                <Communities
                                    communities={communities}
                                />
                            )}
                        </TabPanel>
                    ))
                }
            </Tabs>
    );
};

export default ReviewTabs;
