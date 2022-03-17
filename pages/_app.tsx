/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sort-keys */
import { AppContainer, DesignSystemProvider, Sidebar } from '@impact-market/ui';
import { PrismicDataProvider } from '../libs/Prismic/components/PrismicDataProvider';
import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { setRates } from '../app/state/slices/rates';
import { setToken, setUser } from '../app/state/slices/auth';
import { store } from '../app/state/store';
import { useGetExchangeRatesQuery, useGetExchangeRatesTestMutation } from '../app/api/generic';
import { useGetUserMutation } from '../app/api/user';
import React, { useEffect } from 'react';
import RouteGuard from '../app/components/routeGuard';
import SidebarTEMP from '../app/components/sidebar';
import config from '../config';
import cookies from 'next-cookies';
import type { AppProps } from 'next/app';

const { baseUrl } = config;

const sidebarProps = {
    commonMenu: [
        { icon: 'users', label: 'Communities' },
        { icon: 'tray', label: 'Governance' },
        { icon: 'barChart2', label: 'Global Dashboard' },
        { icon: 'impactMarket', label: 'About Us' }
    ],
    menus: [
        [
            { flag: 'Claim', icon: 'coins', isActive: true, label: 'UBI' },
            { icon: 'bookOpen', label: 'Learn & Earn' },
            { icon: 'flash', label: 'Stories', flag: 4 }
        ]
    ],
    footerMenu: [
        { icon: 'help', label: 'Help' },
        { icon: 'settings', label: 'Settings' },
        { icon: 'flag', label: 'Report Suspicious Activity' },
        { icon: 'bell', label: 'Notifications' }
    ],
    userButton: {
        action: 'function',
        address: '0x43D2...34f7',
        currency: 'Celo',
        photo: {
            url: 'https://picsum.photos/40'
        },
        name: 'Olivia Rhye'
    }
} as any;

const InnerApp = (props: AppProps) => {
    const { Component, pageProps } = props;
    
    const [getUser] = useGetUserMutation();
    // const [getExchangeRatesTest] = useGetExchangeRatesTestMutation();

    // const rates = useGetExchangeRatesQuery();

    // console.log('ratesQuery: ', rates);

    useEffect(() => {
        const init = async () => {
            // const rates = await getExchangeRatesTest().unwrap();

            // console.log('ratesMutation: ', rates);

            // store.dispatch(setRates({ rates }));
            
            if(pageProps.authToken) {
                const user = await getUser().unwrap();

                store.dispatch(setUser({ user }));
            }
        }
        
        init();
    }, [getUser, useGetExchangeRatesQuery, pageProps.authToken]); 

    // Todo
    //  - Add spinner

    return (
        <RouteGuard>
            <SidebarTEMP />
            <AppContainer>
                <Sidebar {...sidebarProps} />
                <Component {...pageProps} />
            </AppContainer>
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
