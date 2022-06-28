import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppContainer, DesignSystemProvider, ModalManager, Toaster, ViewContainer } from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { addNotification } from '../state/slices/notifications';
import { checkCookies, getCookie } from 'cookies-next';
import { getLocation } from '../utils/position';
import { setRates } from '../state/slices/rates';
import { setToken } from '../state/slices/auth';
import { store } from '../state/store';
import { useGetExchangeRatesMutation } from '../api/generic';
import { useGetUnreadNotificationsMutation } from '../api/user';
import ErrorPage from 'next/error';
import GoogleAnalytics from '../components/GoogleAnalytics';
import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';
import WrapperProvider  from '../components/WrapperProvider';
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

    const { authorized, isLoading } = useGuard();

    const [getRates] = useGetExchangeRatesMutation();

    const [getUnreadNotifications] = useGetUnreadNotificationsMutation();

    useEffect(() => {
        const init = async () => {
            try {
                // Prompt user to allow/block access to his location coordinates (no need to "await", we just want the User to allow/block)
                getLocation();

                // Get and save to reducer Exchange Rates
                const rates = await getRates().unwrap();

                store.dispatch(setRates(rates));
            }
            catch (error) {
                console.log(error);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const getFlags = async () => {
            try {
                const numberOfUnreadNotifications = await getUnreadNotifications().unwrap();

                store.dispatch(addNotification({
                    notification: {
                        key: 'notifications',
                        value: numberOfUnreadNotifications?.data || 0
                    }
                }))
                
            } catch (error) {
                console.log(error);
            }
        }

        getFlags();
    }, [])

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

    if(!view) {
        const ErrorContent = ErrorPage as any;

        return <ErrorContent statusCode={404} />;
    }

    if(checkCookies('AUTH_TOKEN')) {
        store.dispatch(setToken({ token: getCookie('AUTH_TOKEN').toString() }));
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
