import { UserTypesType } from '../constants/UserTypes';
import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import useWallet from '../hooks/useWallet';

type CanBeRenderedProps = {
    children: any;
    types?: UserTypesType[];
};

const CanBeRendered = (props: CanBeRenderedProps) => {
    const { address } = useWallet();
    const { children, types } = props;

    const auth = useSelector(selectCurrentUser);
    const authorized = useMemo(() => address && auth?.user && auth?.type?.some(value => types.includes(value as UserTypesType)), [address, auth, types]);

    if (!types.length) {
        return <>{children}</>;
    }

    if (!authorized) {
        return null;
    }


    return <>{children}</>;
}

export default CanBeRendered;
