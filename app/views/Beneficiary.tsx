import { ImpactProvider } from '@impact-market/utils/ImpactProvider';
import { selectCurrentUser } from '../../app/state/slices/auth';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import { useSelector } from 'react-redux';
import { useSigner } from '../utils/useSigner';
// import Community from '../components/community';
// import ExchangeRate from '../components/exchangeRate';
import Countdown from 'react-countdown';
import React, { useState } from 'react';
import config from '../../config';

const Beneficiary = () => {
    const [loading, toggleLoading] = useState(false);

    const auth = useSelector(selectCurrentUser);

    if(!auth?.user?.beneficiary) return <div>User is not Beneficiary!</div>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isReady, claimCooldown, claim, isClaimable, beneficiary: { claimedAmount }, community: { hasFunds, maxClaim } } = useBeneficiary(
        auth?.user?.beneficiary?.community
    );

    const claimFunds = () => {
        toggleLoading(true);
        
        claim().then(() => toggleLoading(false)).catch(() => toggleLoading(false));
    };
    
    const renderer = ({ hours, minutes, seconds, completed }: any) => {
        if(completed) {
            if(loading) return <div>Loading...</div>;

            return <button onClick={claimFunds}>Claim</button>;
        }
        
        return <span>claiming in: {hours} hours || {minutes} minutes || {seconds} seconds</span>;
    };

    const Claim = () => {
        if(!hasFunds) return <div>No funds available!</div>;

        if(!isClaimable) return <Countdown date={new Date(claimCooldown)} renderer={renderer}/>;

        if(loading) return <div>Loading...</div>;

        return <button onClick={claimFunds}>Claim</button>;
    };

    if(!isReady) return <div>Loading...</div>;

    return (
        <div>
            <div>Welcome Beneficiary</div>
            <Claim />
            <div>Already claimed ${claimedAmount} of ${maxClaim}</div>
            {/* <ExchangeRate /> */}
            {/* <Community /> */}
        </div>
    );
};

const WrappedBeneficiary = () => {
    const { address, signer } = useSigner();

    if(address === null || signer === null) return <div>Loading...</div>;

    return (
        <ImpactProvider address={address} jsonRpc={config.networkRpcUrl} signer={signer}>
            <Beneficiary />
        </ImpactProvider>
    );
};

export default WrappedBeneficiary;
