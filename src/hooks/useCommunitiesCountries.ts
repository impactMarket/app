import { getCountryNameFromInitials } from '../utils/countries';
import useSWR from 'swr';

export default function useCommunitiesCountries(status: string) {
    const { data, mutate, error } = useSWR(
        `/communities/count?groupBy=country&status=${status}`
    );

    const communitiesCountries = data?.data.map((row: { country: string }) => ({
        label: getCountryNameFromInitials(row.country),
        value: row.country
    }));

    const loadingCountries = !data && !error;

    return {
        communitiesCountries,
        loadingCountries,
        mutate
    };
}
