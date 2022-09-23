import { getCountryNameFromInitials } from '../utils/countries';
import useSWR from 'swr';

const ITEMS_PER_PAGE = 8;

const basefilters = {
    ambassadorAddress: '',
    country: '',
    limit: ITEMS_PER_PAGE,
    name: '',
    offset: 0,
    orderBy: 'bigger:DESC',
    status: 'valid',
};

export default function useCommunities(incomingFilters: any, fetcher?: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type = null, page, state, ...requestFilters } = incomingFilters;
    const status = state ?? basefilters.status
    const offset = (!page ? 0 : page) * ITEMS_PER_PAGE;
    const filters = {...basefilters, ...{offset, status, ...requestFilters}};

    const queryString = Object.keys(filters)
        .map((key) => `${ key }=${ filters[key] }`)
        .join('&');

    const supportingCountries = [] as any;

    const { data, mutate, error } = useSWR(`/communities?${queryString}`, fetcher);
    
    const loadingCommunities = !data && !error;
    const pageCount = Math.ceil(data?.data?.count / ITEMS_PER_PAGE);

    data?.data?.rows?.map((community: any) => {
        supportingCountries.push(community?.country);
    });

    const uniqueSupportingCountries = [...new Set(supportingCountries)];

    const communitiesCountries = uniqueSupportingCountries.map((country: any) => ({
        label: getCountryNameFromInitials(country),
        value: country
    }));

    return {
        communities: data || { data: [] },
        communitiesCountries,
        itemsPerPage: ITEMS_PER_PAGE,
        loadingCommunities,
        mutate,
        pageCount,
        supportingCommunities: data?.data?.count?.toString() || 0,
        supportingCountries: uniqueSupportingCountries.length
    };
}
