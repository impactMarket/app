import useSWR from 'swr';

export default function usePromoter(communityId: number, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/communities/${communityId}/promoter`,
        fetcher
    );

    const loadingPromoter = !data && !error;

    return {
        loadingPromoter,
        mutate,
        promoter: data?.data
    };
}
