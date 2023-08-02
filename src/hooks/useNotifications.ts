import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import config from '../../config';
import useSWR from 'swr';

export function useNotifications(filters?: any[]) {
    const auth = useSelector(selectCurrentUser);
    const { signature, message, eip712_message, eip712_signature } =
        useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(config.baseApiUrl + url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                eip712signature: eip712_signature,
                eip712value: eip712_message,
                message,
                signature
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(
        `/users/notifications?${
            !!filters?.length
                ? filters?.map((filter: any) => filter).join('&')
                : ''
        }`,
        fetcher
    );

    const loadingNotifications = !data && !error;

    return {
        loadingNotifications,
        mutate,
        notifications: data?.data
    };
}
