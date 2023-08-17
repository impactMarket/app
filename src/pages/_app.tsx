import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
    AppContainer,
    DesignSystemProvider,
    ModalManager,
    Toaster,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider, useSelector } from 'react-redux';
import { getCookie, hasCookie } from 'cookies-next';
import {
    selectCurrentUser,
    setSignature,
    setToken
} from '../state/slices/auth';
import { setRates } from '../state/slices/rates';
import { store } from '../state/store';
import { useAccount } from 'wagmi';
import { useGetExchangeRatesMutation } from '../api/generic';
import ErrorPage from 'next/error';
import GoogleAnalytics from '../components/GoogleAnalytics';
import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';
import WrapperProvider from '../components/WrapperProvider';
import config from '../../config';
import modals from '../modals';
import useGuard from '../hooks/useGuard';
import type { AppProps } from 'next/app';

const { baseUrl, graphUrl } = config;

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: graphUrl
});

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;

    const { withPreview } = pageProps;
    const { authorized, isLoading } = useGuard({ withPreview });

    const [getRates] = useGetExchangeRatesMutation();

    const { isConnected } = useAccount();
    const { signature, eip712_signature } = useSelector(selectCurrentUser);

    useEffect(() => {
        if (isConnected && (!signature || !eip712_signature)) {
            openModal('signature');
        }
    }, [isConnected, signature, eip712_signature]);

    useEffect(() => {
        const init = async () => {
            try {
                // Get and save to reducer Exchange Rates
                const rates = await getRates().unwrap();

                store.dispatch(setRates(rates));
            } catch (error) {
                console.log(error);
            }
        };

        init();
    }, []);

    const Content = Component as any;

    return (
        <AppContainer>
            <Sidebar />
            {isLoading ? (
                <ViewContainer isLoading />
            ) : (
                <>{authorized && <Content {...pageProps} />}</>
            )}
        </AppContainer>
    );
};

const App = (props: AppProps) => {
    const { pageProps, router } = props;
    const { asPath, locale } = router;
    const url = `${baseUrl}/${locale}${asPath}`;

    const { data, meta = {}, view } = pageProps;

    if (!view) {
        const ErrorContent = ErrorPage as any;

        return <ErrorContent statusCode={404} />;
    }

    if (hasCookie('AUTH_TOKEN')) {
        store.dispatch(setToken({ token: getCookie('AUTH_TOKEN').toString() }));
    }

    if (hasCookie('SIGNATURE') && hasCookie('EIP712_SIGNATURE') && hasCookie('MESSAGE') && hasCookie('EIP712_MESSAGE')) {
        store.dispatch(
            setSignature({
                eip712_message: getCookie('EIP712_MESSAGE').toString(),
                eip712_signature: getCookie('EIP712_SIGNATURE').toString(),
                message: getCookie('MESSAGE').toString(),
                signature: getCookie('SIGNATURE').toString()
            })
        );
    }

    return (
        <PrismicDataProvider data={data} url={url} view={view}>
            <DesignSystemProvider>
                <WrapperProvider>
                    <Provider store={store}>
                        <ApolloProvider client={apolloClient}>
                            <SEO meta={meta} />
                            <ModalManager modals={modals} />
                            <Toaster />
                            <InnerApp {...props} />
                            <GoogleAnalytics />
                        </ApolloProvider>
                    </Provider>
                </WrapperProvider>
            </DesignSystemProvider>
        </PrismicDataProvider>
    );
};

export default App;
