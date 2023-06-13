import useSWR from 'swr';

export default function useStory(storyId: string, fetcher?: any) {
    const { data, mutate, error } = useSWR(`/stories/${storyId}`, fetcher);

    const loadingStory = !data && !error;

    return {
        loadingStory,
        mutate,
        story: data?.data
    };
}
