import { Provider } from 'react-redux';
import { SignerProvider } from '../app/utils/useSigner';
import { store } from '../app/state/store';
import React from 'react';
import Sidebar from '../app/components/sidebar';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <SignerProvider>
                <Sidebar />
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </SignerProvider>
        </>
    );
}

export default MyApp;
