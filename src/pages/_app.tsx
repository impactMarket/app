import * as Sentry from '@sentry/browser';
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
import { WagmiConfig, useAccount } from 'wagmi';
import { getCookie, hasCookie } from 'cookies-next';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
import { registerFirebaseSW } from 'src/hooks/useServiceWorker';
import {
    selectCurrentUser,
    setSignature,
    setToken
} from '../state/slices/auth';
import { setRates } from '../state/slices/rates';
import { store } from '../state/store';
import { useGetExchangeRatesMutation } from '../api/generic';
import { wagmiConfig } from '../hooks/useWallet';
import ErrorPage from 'next/error';
import GoogleAnalytics from '../components/GoogleAnalytics';
import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';
import WrapperProvider from '../components/WrapperProvider';
import config from '../../config';
import firebaseApp from 'src/utils/firebase/firebase';
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
    const { signature, eip712_signature, message, eip712_message } =
        useSelector(selectCurrentUser);

    useEffect(() => {
        if (isConnected && (!signature || !eip712_signature)) {
            openModal('signature');
        }

        if (isConnected && (signature || eip712_signature)) {
            const handleFirebaseServiceWorker = async () => {
                if (isSupported) {
                    const messaging = getMessaging(firebaseApp);
                    const permission = await Notification.requestPermission();

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: config.fbVapidKey
                        });

                        if (currentToken) {
                            // Send Firebase token to endpoint /user
                            try {
                                await fetch(`${config.baseApiUrl}/users`, {
                                    body: JSON.stringify({
                                        appPNT: currentToken
                                    }),
                                    headers: {
                                        Accept: 'application/json',
                                        Authorization: `Bearer ${getCookie(
                                            'AUTH_TOKEN'
                                        ).toString()}`,
                                        'Content-Type': 'application/json',
                                        eip712signature: eip712_signature,
                                        eip712value: eip712_message,
                                        message,
                                        signature
                                    },
                                    method: 'PUT'
                                });
                            } catch (e: any) {
                                console.log(e);
                                Sentry.captureException(e);
                            }
                        } else {
                            console.log(
                                'No registration token available. Request permission to generate one.'
                            );
                        }
                    } else {
                        console.log('Notification permission not granted');
                    }
                }
            };

            handleFirebaseServiceWorker();
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

    if (
        hasCookie('SIGNATURE') &&
        hasCookie('EIP712_SIGNATURE') &&
        hasCookie('MESSAGE') &&
        hasCookie('EIP712_MESSAGE')
    ) {
        store.dispatch(
            setSignature({
                eip712_message: getCookie('EIP712_MESSAGE').toString(),
                eip712_signature: getCookie('EIP712_SIGNATURE').toString(),
                message: getCookie('MESSAGE').toString(),
                signature: getCookie('SIGNATURE').toString()
            })
        );
    }

    useEffect(() => {
        registerFirebaseSW();
    }, []);

    return (
        <WagmiConfig config={wagmiConfig}>
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
        </WagmiConfig>
    );
};

export default App;
