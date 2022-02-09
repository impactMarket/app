import { OnlineStatusProvider } from '../app/utils/useOnlineStatus';
import React from 'react';
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('./home'));

const App = () => {
    return (
        <OnlineStatusProvider>
            <Home />
        </OnlineStatusProvider>
    );
};

export default App;
