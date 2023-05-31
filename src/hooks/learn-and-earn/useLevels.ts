import { selectCurrentUser } from '../../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../../config';
import useSWR from 'swr';

export default function useLevels(levels: any) {
    const auth = useSelector(selectCurrentUser);

    let data = Object.values(levels).map((item: any) => {
        return {
            ...item,
            id: null,
            status: 'available',
            totalLessons: item?.lessons?.length,
            totalReward: item?.data?.reward
        };
    });

    if (!auth.token) {
        return {
            data,
            levelsLoading: false
        };
    }

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
            }

            return !!apiLevel
                ? {
                      ...apiLevel,
                      ...levelData,
                      totalReward: item?.data?.reward
                  }
                : null;
        });
    }

    const finalLevels = !config.useTestNet
        ? data.filter((item: any) => item?.data?.is_live)
        : data;
    const levelsLoading = !data && !error;

    return {
        data: finalLevels.filter((item: any) => item !== null),
        levelsLoading
    };
}
