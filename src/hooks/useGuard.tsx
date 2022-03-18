import { selectCurrentUser, setUser } from '../state/slices/auth';
import { store } from '../state/store';
import { useEffect, useState } from 'react';
import { useGetUserMutation } from '../api/user';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// TODO import as const from a routes file
const publicPaths = ['/', '/home'];

const useGuard = () => {
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [getUser] = useGetUserMutation();

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();

    const authCheck = (url: string) => {
        const path = url.split('?');

        if (!auth?.token && !publicPaths.includes(path[0])) {
            setAuthorized(false);
            router.push('/');
        } else {
            setAuthorized(true);
        }
    };

    useEffect(() => {
        const handleRouteComplete = async () => {
            setIsLoading(true)

            try {
                if(auth?.token) {
                    const user = await getUser().unwrap();

                    store.dispatch(setUser({ user }));
                }

                // on initial load - run auth check
                authCheck(router.asPath);

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);

                console.log('Error on init\n', error);
            }
        };

        handleRouteComplete();

        const handleRouteStart = () => {
            setAuthorized(false);
            setIsLoading(true);
        }

        router.events.on('routeChangeStart', handleRouteStart);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', handleRouteComplete);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', handleRouteStart);
            router.events.off('routeChangeComplete', handleRouteComplete);
        };
    }, [auth?.token, router]);

    return { authorized, isLoading };
};

export default useGuard;
