import config from '../../../config';
import useSWR from 'swr';

export default function useLessons(lessons: any, levelId: any, auth: any) {
    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());

    if (levelId) {
        const { data } = useSWR<
            {
                data: {
                    completedToday: boolean;
                    lessons: any[];
                    rewardAvailable: boolean;
                    totalPoints: number;
                };
            },
            string
        >(`/learn-and-earn/levels/${levelId}`, fetcher);

        const { completedToday = false } = data?.data ?? {};

        const mergedLessons = data?.data?.lessons.map((item: any) => {
            const formattedLessons = lessons.map((el: any) => {
                const ids = el.alternate_languages.reduce(
                    (next: any, profile: any) => {
                        return [...next, profile.id];
                    },
                    []
                );

                if ([...ids, el.id].find((it) => it === item.prismicId)) {
                    return { ...el, backendId: item.id, status: item.status };
                }
            });

            return formattedLessons.filter((e: any) => e).pop();
        });

        return {
            completedToday,
            data:
                levelId && mergedLessons
                    ? mergedLessons.filter((e: any) => e)
                    : lessons,
            rewardAvailable: data?.data?.rewardAvailable || false,
            totalPoints: data?.data?.totalPoints || 0
        };
    }

    return {
        completedToday: true,
        data: lessons,
        rewardAvailable: false,
        totalPoints: 0
    };
}
