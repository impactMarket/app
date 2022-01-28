import {
    OnlineStatusProvider,
    useOnlineStatus
} from '../utils/useOnlineStatus';
import { useA2HS } from 'react-use-a2hs';

function Home() {
    const online = useOnlineStatus();

    return (
        <div>
            Hello World
            <br />
            {online ? 'online' : 'offline'}
        </div>
    );
}

const App = () => {
    const [promptEvent, promptToInstall] = useA2HS();

    return (
        <OnlineStatusProvider>
            <Home />
            {promptEvent && (
                <button onClick={promptToInstall}>
                    {'please install PWA'}
                </button>
            )}
        </OnlineStatusProvider>
    );
};

export default App;
