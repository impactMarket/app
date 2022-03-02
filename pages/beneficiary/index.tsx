import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { provider } from '../../app/helpers';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { useSigner } from '../../app/utils/useSigner';
import Community from '../../app/components/community';
import ExchangeRate from '../../app/components/exchangeRate';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../app/state/slices/auth';

function Beneficiary() {
    const { isReady, claimCooldown, claim, isClaimable } = useBeneficiary(
        '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab'
    );

    const Claim = () => {
        if (!isReady) {
            return <div>Loading...</div>;
        }
        if (!isClaimable) {
            return (
                <div>claiming in {new Date(claimCooldown).toISOString()}</div>
            );
        }

        return <button onClick={claim}>Claim</button>;
    };

    return (
        <div>
            <div>Welcome Beneficiary</div>
            <Claim />
            <ExchangeRate />
            <Community />
        </div>
    );
}

function WrappedBeneficiary() {
    const router = useRouter();
    const { address, signer } = useSigner();
    const user = useSelector(selectCurrentUser);

    console.log('user', user);

    useEffect(() => {
        if(!user?.token) {
            router.push('/home');
            return null;
        }
    }, []);

    if (address === null || signer === null) {
        return <div>Loading...</div>;
    }

    return (
        <ImpactProvider address={address} provider={provider} signer={signer}>
            <Beneficiary />
        </ImpactProvider>
    );
}

export default WrappedBeneficiary;
