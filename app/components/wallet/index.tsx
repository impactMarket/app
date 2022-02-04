import '@celo-tools/use-contractkit/lib/styles.css';
import {
    ContractKitProvider,
    useContractKit
} from '@celo-tools/use-contractkit';

function Wallet() {
    const { connect: connectToWallet, address } = useContractKit();

    return (
        <>
            {address ? (
                <div>Connected to {address}</div>
            ) : (
                <button onClick={connectToWallet}>Connect wallet</button>
            )}
        </>
    );
}

function WrappedWallet() {
    return (
        <ContractKitProvider
            dapp={{
                description: 'Decentralized Poverty Alleviation Protocol',
                icon:
                    'https://dzrx8kf1cwjv9.cloudfront.net/impactmarket/PACT_Token_Ticker_Blue@2x.png',
                name: 'impactMarket',
                url: 'https://impactmarket.com'
            }}
        >
            <Wallet />
        </ContractKitProvider>
    );
}

export default WrappedWallet;
