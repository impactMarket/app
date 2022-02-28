import { User } from '../../app/api/user';
import { selectCurrentUser } from '../../app/state/slices/auth';
import { useLocalStorage } from '../../app/utils/useStorage';
import { useSelector } from 'react-redux';
import { useSigner } from '../../app/utils/useSigner';
import React from 'react';

function Profile() {
    const { signer } = useSigner();
    const [localUser] = useLocalStorage<User | undefined>('user', undefined);
    const user = useSelector(selectCurrentUser);

    const sign = () => {
        signer.signMessage('hello').then(console.log);
    };

    console.log('user', user);

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
