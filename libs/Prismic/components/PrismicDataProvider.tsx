import React, { createContext } from 'react';
import baseConfig from '../../../config';
import extractFromData from '../helpers/extractFromData';
import kebabToCamel from '../helpers/kebabToCamel';

const { isProduction } = baseConfig;

const initialData: {
    data?: any;
    url?: string;
    view?: string;
} = {};

export const PrismicDataContext = createContext(initialData);

type ProviderProps = {
    children?: any;
    data?: any;
    url?: string;
    view?: string;
};

export const PrismicDataProvider = ({
    data,
    children,
    url,
    view
}: ProviderProps) => {
    return (
        <PrismicDataContext.Provider value={{ data, url, view }}>
            {children}
        </PrismicDataContext.Provider>
    );
};

type UsePrismicDataOptions = {
    list?: boolean;
};

export const usePrismicData = (options: UsePrismicDataOptions = {}) => {
    const { list } = options;
    const { data, view: viewNameFromContext, url } = React.useContext(
        PrismicDataContext
    );
    const viewName =
        !!viewNameFromContext &&
        `view${viewNameFromContext
            .charAt(0)
            .toUpperCase()}${viewNameFromContext.slice(1)}`;

    const parsedKeysObject = Object.entries(data || {})?.reduce(
        (results, [key, obj]) => ({ ...results, [kebabToCamel(key)]: obj }),
        {}
    ) as any;

    const {
        config,
        modals,
        userConfig,
        translations,
        ...forwardData
    } = parsedKeysObject || {};

    const view = forwardData?.[viewName] || {};

    if (viewName) {
        delete forwardData?.[viewName];
    }

    const extractFromConfig = (key: string) =>
        extractFromData(config?.data || {}, key);

    const extractFromView = (key: string) =>
        extractFromData(view?.data || {}, key);

    const extractFromModals = (modalName: string) =>
        extractFromData(modals?.data || {}, modalName);

    const dataToExport = Object.entries(forwardData).reduce(
        (results, [key, obj]) => ({ ...results, [kebabToCamel(key)]: obj }),
        {}
    );

    if (list && !isProduction) {
        console.log(`Data from prismic\n`, {
            config,
            data: dataToExport,
            modals,
            translations,
            url,
            userConfig,
            view
        });
    }

    return {
        config,
        data: dataToExport,
        extractFromConfig,
        extractFromModals,
        extractFromView,
        modals,
        translations,
        url,
        userConfig,
        view
    };
};

export const PrismicDataConsumer = PrismicDataContext.Consumer;
