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

module.exports = withBundleAnalyzer(
    withPWA({
        pwa: {
            dest: 'public',
            runtimeCaching
        },
        webpack
    })
);
