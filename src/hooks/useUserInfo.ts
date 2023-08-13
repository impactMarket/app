import { selectCurrentUser } from 'src/state/slices/auth';
import { useSelector } from 'react-redux';
import useSWR from 'swr';  
import config from 'config';

const useUserInfo = (address: string) => {
    const auth = useSelector(selectCurrentUser);

    const fetcher = (url: string) => 
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'accept': '*/*',
            }
        }).then((res) => res.json());

    const { data, mutate, error } = useSWR(`${config.baseApiUrl}/users/${address}`, fetcher);

    const loadingUser = !data && !error;

    return {
        userInfo: data?.data,
        loadingUser,
        error,
        mutate
    };
};

export default useUserInfo;
