import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { provider } from '../helpers';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { useSigner } from '../utils/useSigner';
import Community from '../components/community';
import ExchangeRate from '../components/exchangeRate';
import React from 'react';

const Beneficiary = () => {
    const { isReady, claimCooldown, claim, isClaimable, beneficiary: { claimedAmount }, community: { hasFunds, maxClaim } } = useBeneficiary(
        '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab'
    );

    console.log('claimedAmount: ', claimedAmount);
    console.log('hasFunds: ', hasFunds);
    console.log('maxClaim: ', maxClaim);

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
};

const WrappedBeneficiary = () => {
    const { address, signer } = useSigner();

    if (address === null || signer === null) {
        return <div>Loading...</div>;
    }

    return (
        <ImpactProvider address={address} provider={provider} signer={signer}>
            <Beneficiary />
        </ImpactProvider>
    );
};

export default WrappedBeneficiary;
