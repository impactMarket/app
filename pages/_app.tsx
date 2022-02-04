import { Provider } from 'react-redux';
import { store } from '../app/state/store';
import Sidebar from '../app/components/sidebar';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Sidebar />
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </>
    );
}

export default MyApp;
