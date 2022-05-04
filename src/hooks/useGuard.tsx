import { Routes, beneficiaryRoutes, privateRoutes, publicRoutes } from '../utils/routes';
import { getUserTypes, userBeneficiary } from '../utils/users';
import { selectCurrentUser, setType, setUser } from '../state/slices/auth';
import { store } from '../state/store';
// import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useGetUserMutation } from '../api/user';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';


const useGuard = () => {
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [getUser] = useGetUserMutation();
    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    // const [cookies] = useCookies();

    const authCheck = (userPaths: Routes) => {
        // const path = url.split('?');

        console.log(userPaths);
        console.log(router.pathname);
        if(!userPaths.includes(router.pathname)) {
            console.log("if");
            setAuthorized(false);
            router.push('/');
        } 
        else {
            setAuthorized(true);
        }
    };

    const handleRouteComplete = async (_: any, { shallow }: any) => {
        if(!shallow) {
            setIsLoading(true)

            try {
                // Build available User Paths based on his type
                let userPaths = [...publicRoutes];

                // if(cookies?.AUTH_TOKEN) {
                //     store.dispatch(setToken({ token: cookies?.AUTH_TOKEN }));
                // };

                if(auth?.token) {
                    const user = await getUser().unwrap();
                    const type = getUserTypes(user);
                    
                    store.dispatch(setUser({ user }));
                    store.dispatch(setType({ type }));

                    // If there's a login, include the Private Paths
                    userPaths = userPaths.concat(privateRoutes);

                    // Beneficiary type - include the respective Paths
                    if(type?.includes(userBeneficiary)) {
                        userPaths = userPaths.concat(beneficiaryRoutes);
                    }
                }
                // else {
                //     store.dispatch(removeCredentials());
                // }

                console.log(auth);

                // on initial load - run auth check
                authCheck(userPaths);

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);

                console.log('Error on init\n', error);
            }
        }
    };

    useEffect(() => {
        handleRouteComplete(undefined, {});
    }, []);

    useEffect(() => {
        const handleRouteStart = (_: any, { shallow }: any) => {
            if (!shallow) {
                setAuthorized(false);
                setIsLoading(true);
            }
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
