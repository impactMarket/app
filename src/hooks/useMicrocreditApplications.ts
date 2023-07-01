import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export default function useMicrocreditApplications(filters?: any[]) {
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
        `/microcredit/applications?${
            !!filters?.length
                ? filters?.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );


    const loadingApplications = !data && !error;

    return {
        applications: data?.data?.rows,
        count: data?.data?.count,
        loadingApplications,
        mutate
    };
}