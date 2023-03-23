import { format as dateFnsFormat, formatDistanceToNowStrict, fromUnixTime } from 'date-fns';
import { es, fr, ptBR } from 'date-fns/locale';
import langConfig from '../../locales.config';

declare global {
    interface Window {
        __localeId__: string;
    }
}

const dateLocales: { [key: string]: any } = { es, fr, ptBR };

const getLocale = () => {
    try {
        // eslint-disable-next-line no-underscore-dangle
        const dateFnsCode = langConfig.find(({ shortCode }) => shortCode === window?.__localeId__)?.dateFnsCode;

        return dateLocales?.[dateFnsCode];
    } catch (error) {
        return;
    }
};

export const format = (date: any, formatString: string = 'PP') =>
    dateFnsFormat(date, formatString, { locale: getLocale() });

export const dateHelpers = {
    ago: (date: string | Date) => (formatDistanceToNowStrict(new Date(date), { addSuffix: true })),

    compact: (date: string | Date) => (date ? format(new Date(date), 'MMM d, y') : ''),

    complete: (date: number) => (date ? format(new Date(fromUnixTime(date)), `MMM d, y • H:m`) : ''),

    unix: (date: number) => (date ? format(new Date(fromUnixTime(date)), 'MMM d, y') : '')
};
