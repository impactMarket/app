import { GetStaticPaths, GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Community from "../../views/Community"
import Prismic from "../../libs/Prismic/Prismic"
import config from '../../../config';

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    const res = await fetch(
        'https://impactmarket-api-staging.herokuapp.com/api/v2/communities?limit=99'
    );
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
        fallback: true,
        paths
    };
};

export const getStaticProps: GetStaticProps = async ({ locale: lang, previewData, params }) => {

    // Prismic
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-communities'
    });

    //  Dynamic pages
    const { id } = params
    const res = await fetch(`${config.baseApiUrl}/communities/${id}`)
    const community = await res.json()

    return {
        props: {
            communityData: community?.data,
            data,
            view: 'communities'
        },
        revalidate: 10
    };
};

export default Community;
