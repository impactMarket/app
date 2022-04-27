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

export function getCountryFromPhoneNumber(pnumber: string) {
    const phoneNumber = parsePhoneNumber(pnumber);

    if(phoneNumber?.country) {
        const { emoji, name } = countries[phoneNumber.country];

        return `${emoji} ${name}`;
    }

    return 'Unknown';
}
