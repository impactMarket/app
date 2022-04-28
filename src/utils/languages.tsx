import languagesJSON from '../assets/languages.json';

export const languages: {
    [key: string]: {
        name: string;
        nativeName: string;
    };
} = languagesJSON;

export const languagesOptions = Object.entries(languages).map(([key, value]: any) => ({ label: value.name, value: key }));