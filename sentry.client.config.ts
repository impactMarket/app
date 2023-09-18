// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/browser';
import config from './config';

Sentry.init({
    // eslint-disable-next-line no-process-env
    debug: process.env.NODE_ENV === 'development',
    dsn: config.sentryDSN,
    enabled:
        // eslint-disable-next-line no-process-env
        process.env.NODE_ENV !== 'development' && config.useTestNet !== true,
    integrations: [
        new BrowserTracing({
            beforeNavigate: (context) => {
                return {
                    ...context,
                    // You could use your UI's routing library to find the matching
                    // route template here. We don't have one right now, so do some basic
                    // parameter replacements.
                    name: location.pathname
                        .replace(/\/(es|fr|pt|en)\//g, '/[language]/')
                        .replace(
                            /learn-and-earn\/[\w\d-]+\/[\w\d-]+(\?.*)?/g,
                            '/learn-and-earn/[level]/[lesson]'
                        )
                        .replace(/\/\d+/g, '/[id]')
                };
            }
        })
    ],
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampler: (samplingContext) => {
        const error = samplingContext.transactionContext;

        if (error) {
            if (error.tags && error.tags['user_activity']) {
                // if there's any user action, send 100%
                // (it tracks only extremely important errors)
                return 1;
            } else if (
                error.description &&
                (error.description.match(/GeolocationPositionError/i) ||
                    error.description.match(/denied transaction signature/i))
            ) {
                // some things we know and want to ignore
                return 0;
            }
        }

        return 0.1;
    },
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport)
});
