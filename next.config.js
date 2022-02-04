const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const webpack = (config, { webpack }) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        readline: false
    };

    config.plugins.push(new webpack.IgnorePlugin(/^electron$/));

    return config;
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: false
});

// https://github.com/GoogleChrome/workbox/issues/1790
module.exports = withBundleAnalyzer(
    withPWA({
        pwa: {
            dest: 'public',
            // disabled for better dev experience
            // eslint-disable-next-line no-process-env
            disable: process.env.NODE_ENV === 'development',
            runtimeCaching
        },
        webpack
    })
);
