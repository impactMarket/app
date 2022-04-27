import { GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Prismic from "../../libs/Prismic/Prismic"
import Requests from "../../views/Requests"

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-community-requests' });

    return {
        props: {
            data,
            view: 'community-requests'
        }
    };
};

export default Requests;