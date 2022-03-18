import { OnlineStatusProvider } from '../hooks/useOnlineStatus';
import { useA2HS } from 'react-use-a2hs';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import String from '../../libs/Prismic/components/String';

const Home = () => {
    const [promptEvent, promptToInstall] = useA2HS();

    usePrismicData();

    return (
        <OnlineStatusProvider>
            <div>
                <p style={{ color: 'red' }}>
                    <String id="learnAndEarn" />
                </p>
                <Message id="communityFundsWillRunOut" />
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
