/* eslint-disable no-process-env */
import { cleanEnv, str } from 'envalid';

// ATTENTION!
// this is relevant for CI bundlesize step only. Bundlesize needs to run a build
// which uses the NODE_ENV=production.
// So this is the default. If CI_BUNDLESIZE is undefined, then it's replaced.
let env = cleanEnv(process.env, {
    NEXT_PUBLIC_BASE_API_URL: str({
        default: 'https://impactmarket-api-staging.herokuapp.com'
    }),
    NEXT_PUBLIC_NETWORK_JSON_RPC: str({
        default: 'https://alfajores-forno.celo-testnet.org'
    }),
    NODE_ENV: str({
        choices: ['development', 'test', 'production', 'staging']
    })
});

// Used in everything else besided `yarn bundlesize`
if (process.env.CI_BUNDLESIZE === undefined) {
    env = env = cleanEnv(process.env, {
        NEXT_PUBLIC_BASE_API_URL: str({
            devDefault: 'https://impactmarket-api-staging.herokuapp.com'
        }),
        NEXT_PUBLIC_NETWORK_JSON_RPC: str({
            devDefault: 'https://alfajores-forno.celo-testnet.org'
        }),
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        })
    });
}

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
