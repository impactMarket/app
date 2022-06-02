import config from '../../config';

const { gaId } = config;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
    const { gtag } = window as any;

    if (!gtag) {
        return;
    }

    gtag('config', gaId, {
        page_path: url
    });
};
