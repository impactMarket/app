import { GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Communities from "../../views/Communities"
import Prismic from "../../libs/Prismic/Prismic"

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-community' });

    return {
        props: {
            data,
            view: 'community'  
        }
    };
};

export default Communities;
