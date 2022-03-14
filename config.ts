/* eslint-disable sort-keys */
/* eslint-disable no-process-env */
const config = {
    /**
     * Base URL
     */
    baseUrl: process.env.NEXT_PUBLIC_URL!,

    /**
     * Base URL to api
     */
    baseApiUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api`!,

    /*
     * is Production
     */
    isProduction: process.env.NODE_ENV === 'production',

    /*
     * Network jSON RPC
     */
    networkRpcUrl: process.env.NEXT_PUBLIC_NETWORK_JSON_RPC!
};

export default config;
