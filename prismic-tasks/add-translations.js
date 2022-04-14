'use strict';

/* eslint-disable valid-jsdoc */
const fs = require('fs').promises;

/**
 * Helper node function to add strings to `customTypes/pwa-translations`
 *   1. add content to `./.prismic-tasks-inputs/translations.json`
 *   2. run `node ./prismic-tasks/add-translations.js`
 *   3. go to slicemachine and sync with Prismic
 */
const addTranslations = async () => {
    try {
        const translationsFilePath = './customTypes/pwa-translations/index.json';
        const inputFilePath = './.prismic-tasks-inputs/translations.json';

        const current = await fs.readFile(translationsFilePath, { encoding: 'utf-8' });
        const translationsFile = JSON.parse(current);
        const input = await fs.readFile(inputFilePath, { encoding: 'utf-8' });

        const translations = {...translationsFile?.json?.strings};

        const newTranslations = Object.entries({...(JSON.parse(input) || {})}).reduce((result, [label, placeholder]) => ({
            ...result,
            [`string-${label}`]: { config: { label, placeholder }, type: 'Text' }
        }), translations);

        const sorted = Object.keys(newTranslations).sort().reduce((result, key) => ({ ...result, [key]: newTranslations[key] }), {});

        translationsFile.json.strings = sorted;

        const data = JSON.stringify(translationsFile, null, 2);

        await fs.writeFile(translationsFilePath, data);

        console.log('Translations added');
    } catch (error) {
        console.log('Error!!!', error)
    }
};

addTranslations();