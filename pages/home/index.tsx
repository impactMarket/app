import { useA2HS } from 'react-use-a2hs';
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('../../components/Wallet'), { ssr: false });

function Home() {
    const [promptEvent, promptToInstall] = useA2HS();

    return (
        <div>
            Welcome home
            <Wallet />
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
