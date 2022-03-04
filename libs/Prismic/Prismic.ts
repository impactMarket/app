import { ClientConfig, predicate } from '@prismicio/client';
import { PrismicDocument } from '@prismicio/types';
import { configDocuments } from '../../prismic.config';
import { getLocalizedDocuments } from './helpers/getLocalizedDocuments';
import client from './client';
import extractTranslations from './helpers/extractTranslations';
import keysToCamel from './helpers/keysToCamel';
import langConfig from '../../locales.config';
import toArray from './helpers/toArray';

const defaultLang = langConfig.find(({ isDefault }) => isDefault)?.code;

const exceptions = ['pwa-translations'];

type GetByTypesProps = {
    clientOptions?: ClientConfig;
    lang?: string;
    types: string | string[];
};

const Prismic = {
    getByTypes: async ({
        clientOptions = {},
        lang = defaultLang,
        types
    }: GetByTypesProps) => {
        try {
            const api = await client(clientOptions);

            const response = await api.dangerouslyGetAll({
                lang: '*',
                predicates: predicate.any('document.type', [...toArray(types), ...configDocuments])
            });

            const documents = getLocalizedDocuments(response, lang);

            const collection = keysToCamel(documents).reduce(
                (
                    result: {
                        [key: string]: PrismicDocument | PrismicDocument[];
                    },
                    document: PrismicDocument
                ) => {
                    if (exceptions.includes(document?.type)) {
                        return result;
                    };

                    const key = document?.type?.replace('pwa-', '');
                    const entry = result[key];

                    if (entry) {
                        const newEntry = Array.isArray(entry) ? entry : [entry];

                        return { ...result, [key]: [...newEntry, document] };
                    }

                    return { ...result, [key]: document };
                },
                extractTranslations(response)
            );

            return collection;
        } catch (error) {
            console.log(error);

            return {};
        }
    }
};

export default Prismic;
