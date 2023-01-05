import { selectCurrentUser } from '../../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../../config';
import useSWR from 'swr';

export default function useLevels(levels: any) {
    const auth = useSelector(selectCurrentUser);
    let data = [];

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());

    const { data: apiData, error } = useSWR(`/learn-and-earn/levels`, fetcher);

    if (apiData) {
        data = apiData?.data?.rows.map((item: any) => {
            const levelData: {
                totalLessons: number;
                totalReward: number;
                status: string;
                id: string;
            } = item;
            let apiLevel;

            if (levels[item.prismicId]) {
                apiLevel = levels[item.prismicId];
            } else {
                const found = Object.values(levels).filter((elem: any) => {
                    return elem.alternate_languages.find(
                        (it: any) => it.id === item.prismicId
                    );
                });

                const transaltedLevel = found.pop() as Object;

                apiLevel = transaltedLevel ?? null;
            }

            return !!apiLevel
                ? {
                      ...apiLevel,
                      ...levelData
                  }
                : null;
        });
    } else {
        data = Object.values(levels).map((item: any) => {
            return {
                ...item,
                id: null,
                status: 'available',
                totalLessons: item?.lessons?.length,
                totalReward: item?.data?.reward
            };
        });
    }

    const levelsLoading = !data && !error;

    return {
        data: data.filter((item: any) => item !== null),
        levelsLoading
    };
}
