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
    baseApiUrl: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v2`!,

    /*
     * is Production
     */
    isProduction: process.env.NODE_ENV === 'production',

    /*
     * Network jSON RPC
     */
    networkRpcUrl: process.env.NEXT_PUBLIC_NETWORK_JSON_RPC!,

    /*
     * Network jSON RPC
     */
    useTestNet: process.env.NEXT_PUBLIC_TESTNET === "true",

    /*
     * Images URL
     */
    imagesUrl: process.env.NEXT_PUBLIC_IMAGES_URL!,

    /*
     * Images Bucket
     */
    imagesBucket: process.env.NEXT_PUBLIC_IMAGES_BUCKET!,

    /*
     * Explorer URL
     */
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL!,

    /*
     * Graph URL
     */
    graphUrl: process.env.NEXT_PUBLIC_GRAPH_URL!,

    /**
     * Google Analytics
     */
    gaId: process.env.NEXT_PUBLIC_GA,

    /*
     * Public URL
     */
    publicUrl: process.env.NEXT_PUBLIC_URL!
};

export default config;
