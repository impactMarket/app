import { getCountryNameFromInitials } from '../utils/countries';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export default function useCommunitiesReviewsByCountry(
    status: string,
    fetcher?: any
) {
    const { data, mutate, error } = useSWR(
        `/communities/count?groupBy=reviewByCountry&status=${status}`,
        fetcher
    );

    const [countriesCount, setCountriesCount] = useState([]) as any;

    useEffect(() => {
        data?.data.map((x: any) =>
            setCountriesCount((countriesCount: any) => [
                ...countriesCount,
                {
                    count: x?.count - x?.accepted,
                    country: x?.country
                }
            ])
        );
    }, []);

    const removeEmptyCountries = countriesCount?.filter(
        (country: { count: number }) => country?.count != 0
    );

    const communitiesCountries = removeEmptyCountries?.map(
        (row: { country: string }) => ({
            label: getCountryNameFromInitials(row?.country),
            value: row?.country
        })
    );

    const loadingCountries = !data && !error;

    return {
        communitiesCountries,
        data: data?.data,
        loadingCountries,
        mutate
    };
}
