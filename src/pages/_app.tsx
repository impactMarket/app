import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
    AppContainer,
    DesignSystemProvider,
    ModalManager,
    Toaster,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import { getCookie, hasCookie } from 'cookies-next';
import { isSupported } from 'firebase/messaging';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { WagmiConfig, useAccount } from 'wagmi';
import { handleFirebaseServiceWorker } from '../hooks/firebase/handleFirebaseServiceWorker';
import { registerFirebaseSW } from '../hooks/useServiceWorker';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { theme } from '../theme/theme';

import type { AppProps } from 'next/app';
import ErrorPage from 'next/error';
import { useEffect } from 'react';
import config from '../../config';
import { useGetExchangeRatesMutation } from '../api/generic';
import GoogleAnalytics from '../components/GoogleAnalytics';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';
import WrapperProvider from '../components/WrapperProvider';
import useGuard from '../hooks/useGuard';
import { wagmiConfig } from '../hooks/useWallet';
import modals from '../modals';
import {
    selectCurrentUser,
    setSignature,
    setToken
} from '../state/slices/auth';
import { setRates } from '../state/slices/rates';
import { store } from '../state/store';
// https://github.com/vercel/next.js/discussions/49474
if (typeof window !== 'undefined' && !String.prototype.replaceAll) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import('core-js/actual/string/replace-all');
}

const { baseUrl, graphUrl } = config;

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: graphUrl
});

const InnerApp = (props: AppProps) => {
    const { Component, pageProps, router } = props;
    const { asPath } = router;

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
            handleFirebaseServiceWorker(
                eip712_signature,
                eip712_message,
                message,
                signature
            );
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
            {!asPath.includes('/verify-email') && <Sidebar />}
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

    const { data, view } = pageProps;

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
        const registerFirebaseServiceWorker = async () => {
            const hasFirebaseSupport = await isSupported();

            if (hasFirebaseSupport) {
                registerFirebaseSW();
            }
        };

        registerFirebaseServiceWorker();
    }, []);

    return (
        <WagmiConfig config={wagmiConfig}>
            <PrismicDataProvider data={data} url={url} view={view}>
                <DesignSystemProvider>
                    <SEO />
                    <WrapperProvider>
                        <Provider store={store}>
                            <ApolloProvider client={apolloClient}>
                                <ThemeProvider theme={theme}>
                                    <ModalManager modals={modals} />
                                    <Toaster />
                                    <InnerApp {...props} />
                                </ThemeProvider>
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
