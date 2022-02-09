import { Counter } from '../../app/components/counter';
import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { provider } from '../../app/helpers';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import Community from '../../app/components/community';
import ExchangeRate from '../../app/components/exchangeRate';
import React from 'react';

function Beneficiary() {
    const { isReady, claimCooldown, claim } = useBeneficiary(
        '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab'
    );

    return (
        <div>
            <div>Welcome Beneficiary</div>
            <div>{isReady ? claimCooldown.toISOString() : 'loading...'}</div>
            <div>
                {isReady ? (
                    <button onClick={claim}>claim</button>
                ) : (
                    'loading...'
                )}
            </div>
            <Counter />
            <ExchangeRate />
            <Community />
        </div>
    );
}

function WrappedBeneficiary() {
    return (
        <ImpactProvider
            address="0x7110b4Df915cb92F53Bc01cC9Ab15F51e5DBb52F"
            provider={provider}
            signer={null}
        >
            <Beneficiary />
        </ImpactProvider>
    );
}

export default WrappedBeneficiary;
