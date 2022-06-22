/* eslint-disable sort-keys */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const localesConfig = require('./locales.config');

const i18n = {
    defaultLocale:
        localesConfig.find(({ isDefault }) => isDefault)?.code || 'en-US',
    localeDetection: false,
    locales: localesConfig.map(({ code }) => code)
};

const languageRedirects = [
    { source: '/en/:path*', destination: '/:path*' },
    { source: '/fr/:path*', destination: '/fr-FR/:path*' },
    { source: '/es/:path*', destination: '/es-ES/:path*' },
    { source: '/pt-br/:path*', destination: '/pt-BR/:path*' }
].map(redirect => ({ ...redirect, permanent: true }));

const redirects = () => languageRedirects;

const images = {
    domains: ['impact-market.cdn.prismic.io', 'images.prismic.io', 'prismic-io.s3.amazonaws.com', 'dxdwf61ltxjyn.cloudfront.net', 'd3ma540h3o1zlk.cloudfront.net']
};

const webpack = (config, { webpack }) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        readline: false
    };

    return config;
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: false
});

// https://github.com/GoogleChrome/workbox/issues/1790
module.exports = withBundleAnalyzer(
    withPWA({
        i18n,
        images,
        pwa: {
            dest: 'public',
            // disabled for better dev experience
            // eslint-disable-next-line no-process-env
            disable: process.env.NODE_ENV === 'development',
            runtimeCaching
        },
        redirects,
        styledComponents: true,
        webpack
    })
);
