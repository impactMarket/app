import useSWR from 'swr';

export default function useStoryComments(storyId: string, fetcher?: any) {
    const { data, mutate, error } = useSWR(
        `/stories/${storyId}/comments`,
        fetcher,
    );

    const loadingComments = !data && !error;

    return {
        comments: data?.data,
        loadingComments,
        mutate
    };
}
