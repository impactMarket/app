import { GetStaticPaths, GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Community from "../../views/Community"
import Prismic from "../../libs/Prismic/Prismic"
import config from '../../../config';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    const res = await fetch(`${config.baseApiUrl}/communities?status=valid&limit=5`);
    const data = await res.json();

    //  Create dynamic page for each locale
    const paths: any = [];

    !!data.length &&
        data.data.rows.forEach((community: any) => {
            for (const locale of locales) {
                paths.push({
                    locale,
                    params: {
                        id: community.id.toString()
                    }
                });
            }
        });

    return {
        fallback: 'blocking',
        paths
    };
};

export const getStaticProps: GetStaticProps = async ({ locale: lang, previewData, params }) => {

    // Prismic
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-community'
    });

    //  Dynamic pages
    const { id } = params
    const res = await fetch(`${config.baseApiUrl}/communities/${id}`)
    const community = await res.json()

    return {
        props: {
            communityData: community?.data,
            data,
            view: 'community'
        },
        revalidate: 10
    };
};

export default Community;
