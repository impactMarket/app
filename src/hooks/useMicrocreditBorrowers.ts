import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export default function useMicrocreditBorrowers(filters?: any[]) {
    const auth = useSelector(selectCurrentUser);
    const { signature, message } = useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                message,
                signature
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(
        `/microcredit/borrowers?${
            !!filters?.length
                ? filters?.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );

    const loadingBorrowers = !data && !error;

    return {
        borrowers: data?.data?.rows,
        count: data?.data?.count,
        loadingBorrowers,
        mutate
    };
}
