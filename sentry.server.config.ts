// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import config from './config';

Sentry.init({
  // eslint-disable-next-line no-process-env
  debug: process.env.NODE_ENV === 'development',
  dsn: config.sentryDSN,
  // eslint-disable-next-line no-process-env
  enabled: process.env.NODE_ENV !== 'development' && config.useTestNet !== true,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
});
