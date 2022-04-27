'use strict';

/* eslint-disable valid-jsdoc */
const fs = require('fs').promises;

/**
 * Helper node function to sync strings to `customTypes/pwa-translations` input
 *   1. run `node ./prismic-tasks/sync-input-translations.js`
 *   2. now all the translations in `./prismic-task/inputs/translations.json` are synced with custom types
 */
const syncInputTranslations = async() => {
    try {
        const translationsFilePath = './customTypes/pwa-translations/index.json';
        const inputFilePath = './.prismic-tasks-inputs/translations.json';

        const current = await fs.readFile(translationsFilePath, { encoding: 'utf-8' });
        const translationsFile = JSON.parse(current);

        const translationObject = Object.entries(translationsFile?.json?.strings).reduce((result, [key, value]) => {
            return {
                ...result,
                [key.replace('string-', '')]: value?.config?.placeholder
            }
        }, {})

        const data = JSON.stringify(translationObject, null, 2);

        await fs.writeFile(inputFilePath, data);

        console.log('Translations synced!');
    } catch (error) {
        console.log(error)
    }
}

syncInputTranslations();