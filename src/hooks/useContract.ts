import useSWR from 'swr';

export default function useContract(communityId: number, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/communities/${communityId}/contract`,
        fetcher
    );

    const loadingContract = !data && !error;

    return {
        contract: data?.data,
        loadingContract,
        mutate
    };
}
