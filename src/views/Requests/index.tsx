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

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const { user } = useSelector(selectCurrentUser);

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    const [loading, setLoading] = useState(false);
    const [communities, setCommunities] = useState({}) as any;
    const [myCountrySelected, setMyCountrySelected] = useState(true);
    const [review, setReview] = useState('pending');
    
    const [userCountry] = useState(user?.country) as any
    const [allCountries, setAllCountries] = useState({}) as any
    const [otherCountries, setOtherCountries] = useState({}) as any

    const [getCommunities] = useGetCommunitiesMutation();
    const [getReviewsByCountry] = useGetReviewsByCountryMutation()

    useEffect(() => {

        const init = async () => {
            try {
                setLoading(true);

                const communities = await getCommunities({
                    country: myCountrySelected ? (user?.country === null ? 0 : user?.country.toUpperCase()) : undefined,
                    excludeCountry: myCountrySelected ? undefined : (user?.country === null ? 0 : user?.country.toUpperCase()),
                    review
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
    }, [myCountrySelected, review]);

        
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
                loading={loading}
                myCountrySelected={myCountrySelected}
                otherCountries={otherCountries}
                setReview={setReview}
                userCountry={userCountry}
            />
        </ViewContainer>
    );
};

export default Requests;
