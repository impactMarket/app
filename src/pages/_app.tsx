import { AppContainer, DesignSystemProvider, ViewContainer } from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { setRates } from '../state/slices/rates';
import { setToken } from '../state/slices/auth';
import { store } from '../state/store';
import { useGetExchangeRatesQuery } from '../api/generic';
import ErrorPage from 'next/error';
import React from 'react';
import Sidebar from '../components/Sidebar';
import WrapperProvider  from '../components/WrapperProvider';
import config from '../../config';
import cookies from 'next-cookies';
import useGuard from '../hooks/useGuard';
import type { AppProps } from 'next/app';

const { baseUrl } = config;

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;

    const { authorized, isLoading } = useGuard();

    const rates = useGetExchangeRatesQuery();
    
    if(!rates?.isLoading) {
        store.dispatch(setRates(rates.data?.data));
    }

    return (
        <AppContainer>
            <Sidebar />
            {isLoading ? (
                <ViewContainer isLoading />
            ) : (
                <>{authorized && <Component {...pageProps} />}</>
            )}
        </AppContainer>
    );
};

const App = (props: AppProps) => {
    const { pageProps, router } = props;
    const { asPath, locale } = router;
    const url = `${baseUrl}/${locale}${asPath}`;

    const { data, view } = pageProps;
    
    if (!view) {
        return <ErrorPage statusCode={404} />;
    }

    if(pageProps?.authToken) {
        store.dispatch(setToken({ token: pageProps.authToken }))
    };

    return (
        <PrismicDataProvider data={data} url={url} view={view}>
            <DesignSystemProvider>
                <WrapperProvider>
                    <Provider store={store}>
                        <InnerApp {...props} />
                    </Provider>
                </WrapperProvider>
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
