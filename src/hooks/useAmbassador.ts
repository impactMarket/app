import useSWR from 'swr';

export default function useAmbassador(communityId: number, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/communities/${communityId}/ambassador`,
        fetcher
    );

    const loadingAmbassador = !data && !error;

    return {
        ambassador: data?.data,
        loadingAmbassador,
        mutate
    };
}
