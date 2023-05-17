import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export default function useMicrocreditBorrowers(filters?: any[], itemsPerPage?: number) {
    const auth = useSelector(selectCurrentUser);

    const fetcher = (url: string) => fetch(config.baseApiUrl + url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => res.json());

    const { data, mutate, error } = useSWR(
        `/microcredit/borrowers?${!!filters?.length ? filters?.map((filter: any) => filter).join('&') : ''}`,
        fetcher
    );

    const { data: allBorrowers } = useSWR(
        `/microcredit/borrowers?limit=999`,
        fetcher
    );

    const pageCount = Math.ceil(allBorrowers?.data?.length / itemsPerPage);

    const loadingBorrowers = !data && !error;

    return {
        borrowers: data?.data,
        loadingBorrowers,
        mutate,
        pageCount
    };
}
