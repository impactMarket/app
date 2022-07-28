import { getCountryNameFromInitials } from '../../utils/countries';
import useSWR from 'swr';

export default function useCommunitiesCountries() {
    const { data, mutate, error } = useSWR(
        '/communities/count?groupBy=country'
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
