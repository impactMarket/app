/* eslint-disable no-process-env */

const config = {
    /**
     * Base URL to api
     */
    baseApiUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL!}/api`,

    /*
     * RPC URL
     */
    networkRpcUrl: process.env.NEXT_PUBLIC_NETWORK_JSON_RPC!
};

export default config;
