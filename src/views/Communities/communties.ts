import useSWR from 'swr';

const ITEMS_PER_PAGE = 8;

const basefilters = {
    ambassadorAddress: '',
    country: '',
    limit: ITEMS_PER_PAGE,
    name: '',
    offset: 0,
    orderBy: 'bigger:DESC',
    page: 0,
    status: 'valid',
    type: 'all'
};

export default function useCommunities(incomingFilters: any) {
    const filters = { ...basefilters, ...incomingFilters };
    const queryString = Object.keys(filters)
        .map((key) => `${ key }=${ filters[key] }`)
        .join('&');
    const supportingCountries = [] as any;

    const { data, mutate, error } = useSWR(`/communities?${queryString}`);
    
    const loadingCommunities = !data && !error;
    const pageCount = Math.ceil(data?.data?.count / ITEMS_PER_PAGE);

    data?.data?.rows?.map((community: any) => {
        supportingCountries.push(community?.country);
    });

    const uniqueSupportingCountries = [...new Set(supportingCountries)];

    return {
        communities: data || { data: [] },
        itemsPerPage: ITEMS_PER_PAGE,
        loadingCommunities,
        mutate,
        pageCount,
        supportingCommunities: data?.data?.count?.toString() || 0,
        supportingCountries: uniqueSupportingCountries.length
    };
}
