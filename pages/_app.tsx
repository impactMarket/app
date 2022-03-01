import { DesignSystemProvider } from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { store } from '../app/state/store';
import { useGetUserQuery } from '../app/api/user';
import React from 'react';
import Sidebar from '../app/components/sidebar';
import config from '../config';
import type { AppProps } from 'next/app';

const { baseUrl } = config;

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;

    const { data, isLoading, isError } = useGetUserQuery();

    console.log({ data, isError, isLoading });

    // Todo
    //  - Add spinner

    return (
        <>
            <Sidebar />
            <Component {...pageProps} />
        </>
    );
};

const App = (props: AppProps) => {
    const { pageProps, router } = props;
    const { asPath, locale } = router;
    const url = `${baseUrl}/${locale}${asPath}`;

    const { data, view } = pageProps;

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

export default App;
