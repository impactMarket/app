import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export function useMicrocreditBorrowers(filters?: any[]) {
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

export function useMicrocreditBorrower(filters?: any[]) {
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
        `/microcredit/borrower?${
            !!filters?.length
                ? filters?.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );

    const loadingBorrower = !data && !error;

    return {
        borrower: data?.data,
        loadingBorrower,
        mutate
    };
}

export function useMicrocreditBorrowerRepaymentHistory(filters?: any[]) {
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
        `/microcredit/repayment-history?${
            !!filters?.length
                ? filters?.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );

    const loadingRepaymentHistory = !data && !error;

    return {
        count: data?.data?.count,
        loadingRepaymentHistory,
        mutate,
        repaymentHistory: data?.data?.rows
    };
}
