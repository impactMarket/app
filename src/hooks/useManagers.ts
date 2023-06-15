import useSWR from 'swr';

export default function useManagers(
    communityId: number,
    filters?: any[],
    fetcher?: any
) {
    const { data, mutate, error } = useSWR(
        `/communities/${communityId}/managers?${
            !!filters.length
                ? filters.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );

    const loadingManagers = !data && !error;

    return {
        loadingManagers,
        managers: data?.data,
        mutate
    };
}
