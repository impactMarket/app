import { PrismicDocument } from '@prismicio/types';
import extractFromData from './extractFromData';
import keysToCamel from './keysToCamel';
import localesConfig from '../../../../locales.config';

const setLangKey = (locale: string) =>
    localesConfig.find(({ code }) => locale === code.toLowerCase())?.shortCode;

const extractTranslations = (documents: PrismicDocument[]) => {
    const translations = documents
        .filter(({ type }) => type === 'pwa-translations')
        .reduce(
            (results, document) => ({
                ...results,
                [setLangKey(document?.lang)]: {
                    messages: extractFromData(
                        keysToCamel(document?.data),
                        'message'
                    ),
                    strings: extractFromData(
                        keysToCamel(document?.data),
                        'string'
                    )
                }
            }),
            {}
        );

    return { translations };
};

export default extractTranslations;
