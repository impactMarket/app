import { User } from '../../app/api/user';
import { selectCurrentUser } from '../../app/state/slices/auth';
import { useLocalStorage } from '../../app/utils/useStorage';
import { useSelector } from 'react-redux';
import { useSigner } from '../../app/utils/useSigner';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function Profile() {
    const router = useRouter();
    const { signer } = useSigner();
    const [localUser] = useLocalStorage<User | undefined>('user', undefined);
    const user = useSelector(selectCurrentUser);

    console.log('user', user);
    useEffect(() => {
        if(!user?.token) {
            router.push('/home');
            return null;
        }
    }, []);

    const sign = () => {
        signer.signMessage('hello').then(console.log);
    };

    if (!user?.token) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
            <br />
            <div>{JSON.stringify(user)}</div>
            <br />
            <div>address: {localUser?.address}</div>
            <br />
            <button onClick={sign}>sign</button>
        </>
    );
}

export default Profile;
