import { Counter } from '../../app/components/counter';
import { provider } from '../../app/helpers';
import { useBeneficiary } from '@impact-market/utils/useBeneficiary';
import Community from '../../app/components/community';
import ExchangeRate from '../../app/components/exchangeRate';

function Beneficiary() {
    const { isReady, claimCooldown } = useBeneficiary({
        address: '0x7110b4Df915cb92F53Bc01cC9Ab15F51e5DBb52F',
        communityAddress: '0x6dcf4B577309aF974216b46817e98833Ad27c0Ab',
        provider,
        signer: null
    });

    return (
        <div>
            <div>Welcome Beneficiary</div>
            <div>{isReady ? claimCooldown.toISOString() : 'loading...'}</div>
            <Counter />
            <ExchangeRate />
            <Community />
        </div>
    );
}

export default Beneficiary;
