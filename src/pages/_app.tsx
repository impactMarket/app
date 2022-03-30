import { AppContainer, DesignSystemProvider, ModalManager, ViewContainer } from '@impact-market/ui';
import { CookiesProvider, useCookies } from 'react-cookie';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { getLocation } from '../utils/position';
import { setRates } from '../state/slices/rates';
import { setToken } from '../state/slices/auth';
import { store } from '../state/store';
import { useGetExchangeRatesMutation } from '../api/generic';
import ErrorPage from 'next/error';
import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import WrapperProvider  from '../components/WrapperProvider';
import config from '../../config';
import modals from '../modals';
import useGuard from '../hooks/useGuard';
import type { AppProps } from 'next/app';

const { baseUrl } = config;

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;

    const { authorized, isLoading } = useGuard();

    const [getRates] = useGetExchangeRatesMutation();

    useEffect(() => {
        const init = async () => {
            try {
                // Prompt user to allow/block access to his location coordinates
                await getLocation();

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

    if(!view) {
        return <ErrorPage statusCode={404} />;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [cookies] = useCookies();

    if(cookies?.AUTH_TOKEN) {
        store.dispatch(setToken({ token: cookies?.AUTH_TOKEN }));
    };

    return (
        <CookiesProvider>
            <PrismicDataProvider data={data} url={url} view={view}>
                <DesignSystemProvider>
                    <WrapperProvider>
                        <Provider store={store}>
                            <ModalManager modals={modals} />
                            <InnerApp {...props} />
                        </Provider>
                    </WrapperProvider>
                </DesignSystemProvider>
            </PrismicDataProvider>
        </CookiesProvider>
    );
};

export default App;
