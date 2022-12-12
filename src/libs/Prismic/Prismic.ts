import { ClientConfig, predicate } from '@prismicio/client';
import { PrismicDocument } from '@prismicio/types';
import { configDocuments } from '../../../prismic.config';
import { getLocalizedDocuments } from './helpers/getLocalizedDocuments';
import client from './client';
import extractTranslations from './helpers/extractTranslations';
import keysToCamel from './helpers/keysToCamel';
import langConfig from '../../../locales.config';
import toArray from './helpers/toArray';

const defaultLang = langConfig.find(({ isDefault }) => isDefault)?.shortCode;

const exceptions = ['pwa-translations'];

type GetByTypesProps = {
    clientOptions?: ClientConfig;
    lang?: string;
    types: string | string[];
};

const Prismic = {
    getByTypes: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        types
    }: GetByTypesProps) => {
        const lang = langConfig.find(({ shortCode }) => shortCode === langCode)
            ?.code;

        try {
            const api = await client(clientOptions);

            const response = await api.dangerouslyGetAll({
                lang: '*',
                predicates: predicate.any('document.type', [
                    ...toArray(types),
                    ...configDocuments
                ])
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
                    }

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
    },

    getDocumentByType: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        document = ''
    }: any) => {
        const api = await client(clientOptions);
        const response = await api.getAllByType(document);

        return response;
    },

    getAllLevels: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        document = ''
    }: any) => {
        const lang = langConfig.find(({ shortCode }) => shortCode === langCode)
            ?.code;
        const api = await client(clientOptions);
        const response = await api.getAllByType(document, { lang });

        const formatedResponse = response.reduce((next, current) => {
            const { id, lang, data, alternate_languages, uid } = current;
            const { title, lessons, category } = data;

            const filteredLessons = lessons.filter((el: any) => !!el.lesson.id);

            return {
                ...next,
                [id]: {
                    data,
                    title,
                    lang,
                    alternate_languages,
                    lessons: filteredLessons,
                    uid,
                    category: category.id ?? ''
                }
            };
        }, {});

        return formatedResponse;
    },

    getLevelByUID: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        level = ''
    }: any) => {
        const lang = langConfig.find(({ shortCode }) => shortCode === langCode)
            ?.code;

        const api = await client(clientOptions);

        try {
            const response = await api.getByUID('pwa-lae-level', level, {
                lang
            });
            const {
                alternate_languages,
                data,
                id,
                lang: langDocument,
                uid
            } = response;

            const filteredLessons = data.lessons.filter(async (el: any) => {
                // if (!!el.lesson.id) {
                // console.log('......----------------------.......');

                // console.log(el.lesson.id);

                // const test = await api.getByUID('pwa-lae-lesson', {el.lesson.uid});

                // console.log('TESTE-------');
                // console.log(await api.getByID('pwa-lae-lesson', el.lesson.id));

                // }

                return !!el.lesson.id;
            });

            return {
                alternate_languages,
                data: { ...data, lessons: filteredLessons },
                id,
                lang: langDocument,
                uid
            };
        } catch (error) {
            console.log(error);

            return null;
        }
    },
    getLessonByUID: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        lesson = ''
    }: any) => {
        const locale = langConfig.find(
            ({ shortCode }) => shortCode === langCode
        )?.code;
        const api = await client(clientOptions);

        try {
            const response = await api.getByUID('pwa-lae-lesson', lesson, {
                lang: locale
            });

            const { alternate_languages, data, id, lang, uid } = response;

            console.log('cenassssssssss');
            console.log(alternate_languages);

            console.log(
                alternate_languages.filter((elem) => elem.lang === 'en-us')
            );

            return { alternate_languages, ...data, id, lang, uid };
        } catch (error) {
            return null;
        }
    },
    getLessonsByIDs: async ({
        clientOptions = {},
        lang: langCode = defaultLang,
        lessonIds = []
    }: any) => {
        const lang = langConfig.find(({ shortCode }) => shortCode === langCode)
            ?.code;

        const api = await client(clientOptions);

        console.log(lang);

        try {
            const response = await api.getByIDs(lessonIds, { lang });

            const lessonsData = response.results.map((item) => {
                const { uid, alternate_languages, lang, id } = item;
                const { title } = item.data;

                return { uid, title, alternate_languages, lang, id };
            });

            return lessonsData;
        } catch (error) {
            return null;
        }
    },

    getAllCategories: async ({
        clientOptions = {},
        lang: langCode = defaultLang
    }: // lesson = ''
    any) => {
        const lang = langConfig.find(({ shortCode }) => shortCode === langCode)
            ?.code;

        const api = await client(clientOptions);

        try {
            const response = await api.getAllByType('pwa-lae-category', {
                lang
            });

            return response.reduce((next, current) => {
                const { id, lang, data, alternate_languages } = current;
                const { title } = data;

                return { ...next, [id]: { title, lang, alternate_languages } };
            }, {});
        } catch (error) {
            console.log(error);

            return null;
        }
    }
};

export default Prismic;
