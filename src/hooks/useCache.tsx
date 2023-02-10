import { removeCookies } from 'cookies-next';
import { removeCredentials, setSignature } from '../state/slices/auth';
import { useDispatch } from 'react-redux';

const useCache = () => {
    const dispatch = useDispatch();

    const cacheClear = () => {
        dispatch(removeCredentials());
        removeCookies('AUTH_TOKEN', { path: '/' });
        removeCookies('SIGNATURE', { path: '/' });
        removeCookies('MESSAGE', { path: '/' });

        dispatch(
            setSignature({
                message: null,
                signature: null
            })
        );

        localStorage.removeItem('walletconnect');

        return true;
    };

    return { cacheClear };
};

export default useCache;
