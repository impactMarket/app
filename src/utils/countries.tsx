import countriesJSON from '../assets/countries.json';
import parsePhoneNumber from 'libphonenumber-js';

const countries: {
    [key: string]: {
        name: string;
        native: string;
        currency: string;
        languages: string[];
        emoji: string;
    };
} = countriesJSON;

export const countriesOptions = Object.entries(
    countries
).map(([key, value]: any) => ({ label: value.name, value: key }));

export function getCountryFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);

    if (phoneNumber?.country) {
        const { emoji, name } = countries[phoneNumber.country];

        return `${emoji} ${name}`;
    }

    return 'Unknown';
}

export function getCountryNameFromInitials(countryInitials: string) {
    if (countries[countryInitials]) {
        return countries[countryInitials].name;
    }

    return 'Unknown';
}

export function getCountryCurrency(country: string) {
    if (countries[country]) {
        return countries[country].currency;
    }

    return null;
}
