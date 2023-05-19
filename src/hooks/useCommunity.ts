import useSWR from 'swr';

export default function useCommunity(address: string, fetcher?: any) {
    const { data, mutate, error } = useSWR(`/communities/${address}`, fetcher);

    const loadingCommunity = !data && !error;

    return {
        community: data?.data,
        loadingCommunity,
        mutate
    };
}
