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

const ReviewTabs = ({ communities, loading, reviewsByCountry, numberOfCommunitiesByReview, myCountrySelected, userCountry, setReview } : any) => {    

    const [reviews] = useState(['pending', 'claimed', 'declined']);

    //  Get how many communties there are in each review (pending, claimed, declined)
    const numberOfEachReview = (review: any) => {
        let otherCountriesNumberOfReviews = 0
        let myCountryNumberOfReviews = {} as any

        !!myCountrySelected ?
            !!Object.keys(reviewsByCountry).length && (
                reviewsByCountry.filter((communitiesNumber: any) => 
                    userCountry === communitiesNumber?.country).map((quantity: any) => (
                        myCountryNumberOfReviews = quantity
                    )) 
            )
        :
            !!Object.keys(numberOfCommunitiesByReview).length && (
                numberOfCommunitiesByReview.filter((reviewName: any) => reviewName.review === review).map((count: any) => (
                    otherCountriesNumberOfReviews = parseInt(count.count, 10)
                ))
            )

        return !!myCountrySelected ? parseInt(myCountryNumberOfReviews[review], 10) : otherCountriesNumberOfReviews
    }


    return (
            <Tabs>
                <TabList>
                    {reviews.map((review, key) => (
                        <Tab
                            key={key}
                            number={isNaN(numberOfEachReview(review)) ? 0 : numberOfEachReview(review)}
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
