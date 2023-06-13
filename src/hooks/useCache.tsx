import { deleteCookie } from 'cookies-next';
import { removeCredentials, setSignature } from '../state/slices/auth';
import { useDispatch } from 'react-redux';

const useCache = () => {
    const dispatch = useDispatch();

    const cacheClear = () => {
        dispatch(removeCredentials());
        deleteCookie('AUTH_TOKEN', { path: '/' });
        deleteCookie('SIGNATURE', { path: '/' });
        deleteCookie('MESSAGE', { path: '/' });

        dispatch(
            setSignature({
                message: null,
                signature: null
            })
        );

        return true;
    };

    return { cacheClear };
};

export default useCache;
