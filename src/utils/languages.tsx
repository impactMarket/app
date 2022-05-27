import langConfig from '../../locales.config';

export const languagesOptions = Object.entries(langConfig).map(([, value]: any) => ({ flagKey: value.flagKey, label: value.label, value: value.code }));
