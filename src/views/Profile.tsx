import { User } from '../api/user';
import { selectCurrentUser } from '../state/slices/auth';
import { useLocalStorage } from '../hooks/useStorage';
import { useSelector } from 'react-redux';
import { useSigner } from '../hooks/useSigner';
import React from 'react';

function Profile() {
    const { signer } = useSigner();
    const [localUser] = useLocalStorage<User | undefined>('user', undefined);
    const user = useSelector(selectCurrentUser);

    const sign = () => {
        signer.signMessage('hello').then(console.log);
    };

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
