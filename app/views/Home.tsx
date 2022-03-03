import { OnlineStatusProvider } from '../utils/useOnlineStatus';
import { useA2HS } from 'react-use-a2hs';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';

const Home = () => {
    const [promptEvent, promptToInstall] = useA2HS();

    usePrismicData({ list: true });

    return (
        <OnlineStatusProvider>
            <div>
                Welcome home
                <div>
                    <p>check console...</p>
                    {promptEvent && (
                        <button onClick={promptToInstall}>
                            please install PWA
                        </button>
                    )}
                </div>
            </div>
        </OnlineStatusProvider>
    );
};

export default Home;
