import { toToken } from '@impact-market/utils/toToken';
import { useA2HS } from 'react-use-a2hs';

function Home() {
    const [promptEvent, promptToInstall] = useA2HS();

    return (
        <div>
            Welcome home
            {toToken(2)}
            <div>
                {promptEvent && (
                    <button onClick={promptToInstall}>
                        {'please install PWA'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;
