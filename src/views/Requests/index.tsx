import React, { useEffect, useState } from 'react';

import {
    Display,
    ViewContainer
} from '@impact-market/ui';

import { useGetCommunitiesMutation, useGetReviewsByCountryMutation, useGetReviewsCountMutation } from '../../api/community';
import { useGetUserMutation } from '../../api/user';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import CountryTabs from './CountryTabs'
import ReviewTabs from './ReviewTabs'
import RichText from '../../libs/Prismic/components/RichText';

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    //  Review has 4 states: 'pending', 'accepted', 'claimed', 'declined'

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [myCountrySelected, setMyCountrySelected] = useState(true);
    const [review, setReview] = useState('pending');
    
    const [userCountry, setUserCountry] = useState() as any
    const [numberOfCommunitiesByReview, setNumberOfCommunitiesByReview] = useState({}) as any
    const [reviewsByCountry, setReviewsByCountry] = useState({}) as any

    const [getCommunities] = useGetCommunitiesMutation();
    const [getReviewsByCountry] = useGetReviewsByCountryMutation()
    const [getReviewsCount] = useGetReviewsCountMutation()
    const [getUser] = useGetUserMutation();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true);

                const user: any = await getUser();
                const communities = await getCommunities({
                    // eslint-disable-next-line no-nested-ternary
                    country: myCountrySelected ? (user?.data?.country === null ? 0 : user?.data?.country) : undefined,
                    review
                });
                const reviews = await getReviewsCount().unwrap()
                const reviewsByCountry = await getReviewsByCountry("pending").unwrap()

                setCommunities(communities);
                setUserCountry(user?.data?.country)
                setNumberOfCommunitiesByReview(reviews)
                setReviewsByCountry(reviewsByCountry)

                setLoading(false);
            } catch (error) {
                console.log(error);

                return false;
            }
        };

        init();
    }, [myCountrySelected, review]);

    
    return (
        <ViewContainer isLoading={isLoading}>
            <Display g900 medium>
                {title}
            </Display>
            <RichText content={content} g500 mt={0.25} />
            <CountryTabs 
                reviewsByCountry={reviewsByCountry}
                setMyCountrySelected={setMyCountrySelected}
                userCountry={userCountry}
            />
            <ReviewTabs 
                communities={communities}
                loading={loading}
                myCountrySelected={myCountrySelected}
                numberOfCommunitiesByReview={numberOfCommunitiesByReview}
                reviewsByCountry={reviewsByCountry}
                setReview={setReview}
                userCountry={userCountry}
            />
        </ViewContainer>
    );
};

export default Requests;
