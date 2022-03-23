import { PrismicDocument } from '@prismicio/types';
import extractFromData from './extractFromData';
import keysToCamel from './keysToCamel';

const extractTranslations = (documents: PrismicDocument[]) => {
    const translations = documents.filter(({ type }) => type === 'pwa-translations').reduce((results, document) => ({
        ...results,
        [document?.lang]: {
            messages: extractFromData(keysToCamel(document?.data), 'message'),
            strings: extractFromData(keysToCamel(document?.data), 'string')
        }
    }), {});

    return { translations }
}

export default extractTranslations;
