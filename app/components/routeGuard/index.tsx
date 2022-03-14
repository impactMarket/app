import { selectCurrentUser } from '../../state/slices/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const RouteGuard = ({ children }: any) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const auth = useSelector(selectCurrentUser);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setAuthorized(false);

        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    const authCheck = (url: string) => {
        const publicPaths = ['/', '/home'];
        const path = url.split('?');

        if(!auth?.token && !publicPaths.includes(path[0])) {
            setAuthorized(false);
            router.push('/');
        }
        else {
            setAuthorized(true);
        }
    }

    return (authorized && children);
}

export default RouteGuard;