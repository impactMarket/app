/* eslint-disable no-nested-ternary */
import { getCountryNameFromInitials } from '../utils/countries';
import useSWR from 'swr';

interface CountryOption {
    label: string;
    value: number;
}

export default function useCommunitiesCountries(status: string, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/communities/count?groupBy=country&status=${status}`,
        fetcher
    );

    const communitiesCountries = data?.data
        .map((row: { country: string }) => ({
            label: getCountryNameFromInitials(row.country),
            value: row.country
        }))
        .sort((a: CountryOption, b: CountryOption) => {
            const labelA = a.label.toUpperCase();
            const labelB = b.label.toUpperCase();

            return labelA < labelB ? -1 : labelA > labelB ? 1 : 0;
        });

    const loadingCountries = !data && !error;

    return {
        communitiesCountries,
        loadingCountries,
        mutate
    };
}
