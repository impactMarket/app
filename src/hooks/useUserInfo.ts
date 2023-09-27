import { selectCurrentUser } from 'src/state/slices/auth';
import { useSelector } from 'react-redux';
import config from 'config';
import useSWR from 'swr';

const useUserInfo = (address: string) => {
    const auth = useSelector(selectCurrentUser);

    const fetcher = (url: string) =>
        fetch(url, {
            headers: {
                Authorization: `Bearer ${auth.token}`,
                accept: '*/*'
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(
        `${config.baseApiUrl}/users/${address}`,
        fetcher
    );

    const loadingUser = !data && !error;

    return {
        error,
        loadingUser,
        mutate,
        userInfo: data?.data
    };
};

export default useUserInfo;
