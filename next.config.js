/* eslint-disable sort-keys */
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const localesConfig = require('./locales.config');
const { withSentryConfig } = require('@sentry/nextjs');

const i18n = {
    defaultLocale:
        localesConfig.find(({ isDefault }) => isDefault)?.shortCode || 'en',
    localeDetection: false,
    locales: localesConfig.map(({ shortCode }) => shortCode)
};

const languageRedirects = [
    { source: '/en/:path*', destination: '/:path*' },
    { source: '/es-ES/:path*', destination: '/es/:path*' },
    { source: '/es-es/:path*', destination: '/es/:path*' },
    { source: '/fr-FR/:path*', destination: '/fr/:path*' },
    { source: '/fr-fr/:path*', destination: '/fr/:path*' },
    { source: '/pt-br/:path*', destination: '/pt/:path*' },
    { source: '/pt-BR/:path*', destination: '/pt/:path*' }
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

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    // eslint-disable-next-line no-process-env
    dryRun: process.env.VERCEL_ENV !== 'production',
    hideSourceMaps: false,
    setCommits: {
        auto: true,
        ignoreMissing: true,
    },
    deploy: {
        // eslint-disable-next-line no-process-env
        env: process.env.VERCEL_ENV || 'development'
    },
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// https://github.com/GoogleChrome/workbox/issues/1790
module.exports = withBundleAnalyzer(
    withSentryConfig(
        withPWA({
            i18n,
            images,
            pwa: {
                dest: 'public',
                // disabled for better dev experience
                // eslint-disable-next-line no-process-env
                disable: true,
                runtimeCaching
            },
            redirects,
            styledComponents: true,
            webpack
        }),
        sentryWebpackPluginOptions
    )
);
