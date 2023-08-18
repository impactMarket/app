// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import config from './config';

Sentry.init({
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    // eslint-disable-next-line no-process-env
    debug: process.env.NODE_ENV === 'development',
    
    dsn: config.sentryDSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 0.1,
});
