import { FilledLinkToDocumentField } from '@prismicio/types';
import langConfig from '../../locales.config';

const exceptions = [] as string[];

const homepageRedirects = [
    'translations-site-temp',
    'translations',
    'config',
    'dao_articles',
    'homepage',
    'modals'
];

const clearPrefix = (type?: string, prefix: string = '') => {
    if (!type) {
        return '';
    }

    return type.replace(`pwa-${prefix}`, '');
};

const linkResolver = (doc: FilledLinkToDocumentField) => {
    const lang = langConfig.find(({ code }) => code.toLowerCase() === doc?.lang)
        ?.code;

    if (exceptions.includes(doc.type)) {
        return null;
    }

    if (homepageRedirects.includes(clearPrefix(doc.type))) {
        return `/${lang}`;
    }

    return `/${lang}/${clearPrefix(doc.type, 'view-')}`;
};

export default linkResolver;
