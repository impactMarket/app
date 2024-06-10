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
     * Network Id
     */
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID!, 10),

    /*
     * Network jSON RPC
     */
    useTestNet: process.env.NEXT_PUBLIC_TESTNET === 'true',

    /*
     * Images URL
     */
    imagesUrl: process.env.NEXT_PUBLIC_IMAGES_URL!,

    /*
     * Images Bucket
     */
    imagesBucket: process.env.NEXT_PUBLIC_IMAGES_BUCKET!,

    /*
     * Microcredit Bucket
     */
    microcreditBucket: process.env.NEXT_PUBLIC_MICROCREDIT_BUCKET!,

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
    publicUrl: process.env.NEXT_PUBLIC_URL!,

    /**
     * MapBox API Key
     */
    mapBoxApiKey: process.env.NEXT_PUBLIC_MAPBOX_KEY!,

    /**
     * MapBox API style
     */
    mapBoxStyle: process.env.NEXT_PUBLIC_MAPBOX_STYLE!,

    /**
     * Google Places Key
     */
    googlePlacesKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY,

    /**
     * Sentry DSN
     */
    sentryDSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    /**
     * cUSD smart contract address
     */
    cUSDAddress: process.env.NEXT_PUBLIC_CUSD_ADDRESS,

    /**
     * Number of days until a signature is expired
     */
    signatureExpires: process.env.NEXT_PUBLIC_SIGNATURE_EXPIRES,

    /**
     * Signature message to confirm signature
     */
    signatureMessage: process.env.NEXT_PUBLIC_SIGNATURE_MESSAGE,

    /**
     * Feature flag for learn and earn
     */
    enableLearnEarn: process.env.NEXT_PUBLIC_ENABLE_LEARN_EARN,

    /**
     * Support URL
     */
    supportURL: process.env.NEXT_PUBLIC_SUPPORT_URL,

    /**
     * WalletConnect project id, mandatory for WalletConnect v2
     */
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,

    /**
     * Firebase: push notifications config
     * */
    fbApiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    fbAuthDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    fbProjectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    fbStorageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    fbMessagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
    fbAppId: process.env.NEXT_PUBLIC_FB_APP_ID,
    fbVapidKey: process.env.NEXT_PUBLIC_FB_VAPID_KEY,
    fbMeasurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,

    /*
     * Microcredit Manager Admin
     */
    microcreditManagerAdmin: process.env.NEXT_PUBLIC_MICROCREDIT_MANAGER_ADMIN,

    /*
     * ClientId for L&E
     */
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

    /*
     *	Email verification URL
     */
    verifyEmailUrl: process.env.NEXT_PUBLIC_VERIFY_EMAIL_URL
};

export default config;
