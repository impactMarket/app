import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export default function useSuspiciousReports(
    communityId?: string,
    limit?: number,
    offset?: number
) {
    const auth = useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: { Authorization: `Bearer ${auth.token}` }
        }).then((res) => res.json());

    const { data, error } = useSWR(
        `/users/report?${communityId ? `community=${communityId}` : ''}${
            !!limit ? `&limit=${limit}` : ''
        }${!!offset ? `&offset=${offset}` : ''}`,
        fetcher
    );

    const loading = !data && !error;

    return {
        data: data?.data,
        error,
        loadingReports: loading
    };
}
