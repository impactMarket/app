import { useA2HS } from 'react-use-a2hs';
import React from 'react';

function Home() {
    const [promptEvent, promptToInstall] = useA2HS();

    return (
        <div>
            Welcome home
            <div>
                {promptEvent && (
                    <button onClick={promptToInstall}>
                        please install PWA
                    </button>
                )}
            </div>
        </div>
    );
}

export default Home;
