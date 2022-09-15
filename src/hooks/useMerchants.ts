import useSWR from 'swr';

export default function useMerchant(communityId: string, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/communities/${communityId}/merchant`,
        fetcher
    );

    const loadingMerchants = !data && !error;

    return {
        loadingMerchants,
        merchants: data?.data,
        mutate
    };
}
