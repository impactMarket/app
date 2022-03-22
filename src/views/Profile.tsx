import { User } from '../api/user';
import { selectCurrentUser } from '../state/slices/auth';
import { useLocalStorage } from '../hooks/useStorage';
import { useSelector } from 'react-redux';
import React from 'react';

function Profile() {
    const [localUser] = useLocalStorage<User | undefined>('user', undefined);
    const user = useSelector(selectCurrentUser);

    return (
        <>
            <br />
            <div>{JSON.stringify(user)}</div>
            <br />
            <div>address: {localUser?.address}</div>
        </>
    );
}

export default Profile;
