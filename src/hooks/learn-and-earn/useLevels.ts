import useSWR from 'swr';
import config from '../../../config';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../state/slices/auth';

export default function useLevels(levels: any) { //endpoint, 
    const auth = useSelector(selectCurrentUser);
    let data = [];

    const fetcher = (url: string) =>
    fetch(config.baseApiUrl + url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => res.json());

    const { data: apiData, error } = useSWR(`/learn-and-earn/levels`, fetcher);
    
    if (apiData) {
        data = apiData?.data?.rows.map((item: any) => {
            const levelData: { totalLessons: number, totalReward: number, status: string, id: string } = item;
            let apiLevel;

            if (levels[item.prismicId]) {
                apiLevel = levels[item.prismicId];
            } else {
                const found = Object.values(levels).filter((elem: any) => {
                    return elem.alternate_languages.find((it) => it.id === item.prismicId);
                });

                const transaltedLevel = found.pop() as Object;

                apiLevel = transaltedLevel ?? null
            }

            return !!apiLevel ? {
                ...apiLevel,
                ...levelData,
            } : null
        });
    } else {
        data = Object.values(levels).map((item: any) => {
            return {
                ...item,
                id: null,
                totalLessons: item?.lessons?.length,
                totalReward: item?.data?.reward,
                status: 'available'
            };
        });
    }

    return {
        data: data.filter(item => item !== null)
    }
}
