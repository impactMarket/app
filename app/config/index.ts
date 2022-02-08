import { cleanEnv, str } from 'envalid';

// eslint-disable-next-line no-process-env
const env = cleanEnv(process.env, {
    NEXT_PUBLIC_BASE_API_URL: str({
        devDefault: 'https://impactmarket-api-staging.herokuapp.com'
    }),
    NEXT_PUBLIC_NETWORK_JSON_RPC: str({
        devDefault: 'https://alfajores-forno.celo-testnet.org'
    }),
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] })
});

const config = {
    /**
     * Base URL to api
     */
    baseApiUrl: `${env.NEXT_PUBLIC_BASE_API_URL}/api`,

    /*
     * RPC URL
     */
    networkRpcUrl: env.NEXT_PUBLIC_NETWORK_JSON_RPC
};

export default config;
