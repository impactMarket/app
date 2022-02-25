import { User, useCreateUserMutation } from '../../app/api/user';
import { useLocalStorage } from '../../app/utils/useStorage';
import { useSigner } from '../../app/utils/useSigner';
import React from 'react';

function Profile() {
    const { address, signer } = useSigner();
    const [localUser, setLocalUser] = useLocalStorage<User | undefined>(
        'user',
        undefined
    );
    const [createUser, createUserResult] = useCreateUserMutation();

    const auth = async () => {
        try {
            const payload = await createUser({ address }).unwrap();

            setLocalUser(payload);

            console.log('fulfilled', payload);
        } catch (error) {
            console.error('rejected', error);
        }
    };

    const sign = () => {
        signer.signMessage('hello').then(console.log);
    };

    return (
        <>
            {createUserResult.isLoading ? 'Loading...' : null}
            <div>{localUser?.address}</div>
            <button onClick={auth}>auth</button>
            <button onClick={sign}>sign</button>
        </>
    );
}

export default Profile;
