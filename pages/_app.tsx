import { DesignSystemProvider } from '@impact-market/ui';
import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { store } from '../app/state/store';
import { useGetUserQuery } from '../app/api/user';
import React from 'react';
import Sidebar from '../app/components/sidebar';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const { data, isLoading, isError } = useGetUserQuery();

    console.log({ data, isError, isLoading });

    return (
        <>
            <Sidebar />
            <Component {...pageProps} />
        </>
    );
}

function WrappedMyApp(props: AppProps): JSX.Element {
    return (
        <DesignSystemProvider>
            <SignerProvider>
                <Provider store={store}>
                    <MyApp {...props} />
                </Provider>
            </SignerProvider>
        </DesignSystemProvider>
    );
}

export default WrappedMyApp;
