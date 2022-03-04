import { DesignSystemProvider } from '@impact-market/ui';
import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { store } from '../app/state/store';
import { useGetUserQuery } from '../app/api/user';
import React, { useEffect } from 'react';
import Sidebar from '../app/components/sidebar';
import type { AppProps } from 'next/app';
import RouteGuard from '../app/components/routeGuard';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    //const { data, isLoading, isError } = useGetUserQuery();

    //console.log({ data, isError, isLoading });

    return (
        <>
            <Sidebar />
            <Component {...pageProps} />
        </>
    );
}

function WrappedMyApp(props: AppProps): JSX.Element {
    useEffect(() => {
        console.log('root: ', store.getState());

        // if(pageProps?.user) {
        //   store.dispatch(SaveUser(pageProps.user));
        // }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [store]);

    return (
        <DesignSystemProvider>
            <SignerProvider>
                <Provider store={store}>
                    <RouteGuard>
                        <MyApp {...props} />
                    </RouteGuard>
                </Provider>
            </SignerProvider>
        </DesignSystemProvider>
    );
}

export default WrappedMyApp;
