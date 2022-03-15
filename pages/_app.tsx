import { DesignSystemProvider } from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { setToken, setUser } from '../app/state/slices/auth';
import { store } from '../app/state/store';
import { useGetUserMutation } from '../app/api/user';
import React, { useEffect } from 'react';
import RouteGuard from '../app/components/routeGuard';
import Sidebar from '../app/components/sidebar';
import config from '../config';
import cookies from 'next-cookies';
import type { AppProps } from 'next/app';

const { baseUrl } = config;

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;
    
    const [getUser] = useGetUserMutation();

    useEffect(() => {
        const init = async () => {
            if(pageProps.authToken) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const user = await getUser().unwrap();

                store.dispatch(setUser({ user }));
            }
        }
        
        init();
    }, [getUser, pageProps.authToken]);    

    // Todo
    //  - Add spinner

    return (
        <RouteGuard>
            <Sidebar />
            <Component {...pageProps} />
        </RouteGuard>
    );
};

const App = (props: AppProps) => {
    const { pageProps, router } = props;
    const { asPath, locale } = router;
    const url = `${baseUrl}/${locale}${asPath}`;

    const { data, view } = pageProps;

    if(pageProps.authToken) store.dispatch(setToken({ token: pageProps.authToken }));

    return (
        <PrismicDataProvider data={data} url={url} view={view}>
            <DesignSystemProvider>
                <SignerProvider>
                    <Provider store={store}>
                        <InnerApp {...props} />
                    </Provider>
                </SignerProvider>
            </DesignSystemProvider>
        </PrismicDataProvider>
    );
};

App.getInitialProps = ({ ctx }: any) => {
    const { AUTH_TOKEN } = cookies(ctx);

    return { 
        pageProps: {
            authToken: AUTH_TOKEN
        } 
    };
};

export default App;
