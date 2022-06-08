import { ambassadorRoutes, beneficiaryRoutes, managerRoutes, privateRoutes, publicRoutes } from '../utils/routes';
import { getUserTypes, userAmbassador, userBeneficiary, userManager } from '../utils/users';
import { pageview } from '../helpers/gtag';
import { selectCurrentUser, setType, setUser } from '../state/slices/auth';
import { store } from '../state/store';
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

    const handleRouteStart = (_: any, { shallow }: any) => {
        if(!shallow) {
            setIsLoading(true);
        }
    }

    const handleRouteComplete = (url: string) => {
        pageview(url);
    }

    useEffect(() => {
        const authCheck = async () => {
            try {
                // Build available User Paths based on his type
                let userPaths = [...publicRoutes];
    
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

                    // Manager type - include the respective Paths
                    if(type?.includes(userManager)) {
                        userPaths = userPaths.concat(managerRoutes);
                    }

                    // Ambassador type - include the respective Paths
                    if(type?.includes(userAmbassador)) {
                        userPaths = userPaths.concat(ambassadorRoutes);
                    }


                    // Ambassador type - include the respective Paths
                    if(type?.includes(userAmbassador)) {
                        userPaths = userPaths.concat(ambassadorRoutes);
                    }
                }
    
                if(!userPaths.includes(router.pathname)) {
                    setAuthorized(false);
                    router.push('/');
                } 
                else {
                    setAuthorized(true);
                }

                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
    
                console.log('Error on auth check\n', error);
            }
        };

        authCheck();

        router.events.on('routeChangeStart', handleRouteStart);

        router.events.on('routeChangeComplete', handleRouteComplete);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', handleRouteStart);

            router.events.off('routeChangeComplete', handleRouteComplete);
        };
    }, [auth?.token, router.pathname]);

    return { authorized, isLoading };
};

export default useGuard;
