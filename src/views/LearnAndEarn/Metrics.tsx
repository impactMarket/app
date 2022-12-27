import { Display, ProgressCard } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../../config';
import useSWR from 'swr';

const Metrics = () => {
    const auth = useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());
    const { data } = useSWR(`/learn-and-earn`, fetcher);

    const totals = data?.data;

    const totalData = [
        { ...totals?.level, label: 'Levels Completed' },
        { ...totals?.lesson, label: 'Lessons Completed' }
        // { ...totals?.reward, label: 'Earned' }
    ];

    return (
        <>
            {totalData.map((item, idx) => (
                <ProgressCard
                    label={item.label}
                    progress={
                        item?.completed ?? (item?.received / item?.total) * 100
                    }
                    pathColor="p600"
                    flex
                    fGrow={1}
                    maxW="32%"
                    ml={!idx ? 0 : '1.5%'}
                    margin="1.5rem 0 1rem"
                >
                    <Display semibold>
                        {`${item?.completed ?? item?.received} `}
                        <span
                            style={{
                                fontWeight: 400
                            }}
                        >
                            {'of'}
                        </span>
                        {` ${item?.total}`}
                    </Display>
                </ProgressCard>
            ))}
        </>
    );
};

export default Metrics;
