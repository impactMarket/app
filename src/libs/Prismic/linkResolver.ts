import { FilledLinkToDocumentField } from '@prismicio/types';
import langConfig from '../../../locales.config';

const exceptions = [] as string[];

const homepageRedirects = [
    'translations-site-temp',
    'translations',
    'config',
    'homepage',
    'modals'
];

const viewRedirects = {
    'community-requests': 'requests',
    'manager-add-community': 'manager/communities/add',
    'manager-beneficiaries': 'manager/beneficiaries',
    'manager-dashboard': 'manager',
    'manager-managers': 'manager/managers'
} as any;

const clearPrefix = (type?: string, prefix: string = '') => {
    if (!type) {
        return '';
    }

    return type?.replace(`pwa-${prefix}`, '');
};

const linkResolver = (doc: FilledLinkToDocumentField) => {
    const lang = langConfig.find(
        ({ code }) => code.toLowerCase() === doc?.lang
    )?.shortCode;

    if (exceptions.includes(doc.type)) {
        return '';
    }

    if (homepageRedirects.includes(clearPrefix(doc.type))) {
        return `/${lang}`;
    }

    const viewKey = clearPrefix(doc.type, 'view-');

    if (Object.keys(viewRedirects).includes(viewKey)) {
        const path = viewRedirects[viewKey] || '';

        return `/${lang}/${path}`;
    }

    return `/${lang}/${clearPrefix(doc.type, 'view-')}`;
};

export default linkResolver;
