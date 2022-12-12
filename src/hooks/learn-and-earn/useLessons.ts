import useSWR from 'swr';
import config from '../../../config';
// import { useSelector } from 'react-redux';
// import { selectCurrentUser } from '../../state/slices/auth';

export default function useLessons(lessons: any, levelId: any, auth: any) {
    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());

    // const av = lessons[0].alternate_languages.reduce((next: any, profile: any) => {
    //     return [...next, profile.id];
    // }, []);

    if (levelId) {
        const { data, error } = useSWR(
            `/learn-and-earn/levels/${levelId}/lessons`,
            fetcher
        );

        const mergedLessons = data?.data?.map((item: any) => {
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
            data:
                levelId && mergedLessons
                    ? mergedLessons.filter((e: any) => e)
                    : lessons
        };
    }

    return {
        data: lessons
    };
}
