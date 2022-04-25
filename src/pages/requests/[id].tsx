import { GetStaticPaths, GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Prismic from "../../libs/Prismic/Prismic"
import SingleRequest from "../../views/Requests/[id]"

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
    const res = await fetch(
        'https://impactmarket-api-staging.herokuapp.com/api/v2/communities?limit=99'
    );
    const data = await res.json();

    //  CREATE DYNAMIC PAGE FOR EACH LOCALE
    const paths: any = [];

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

    // PRISMIC
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-requests'
    });
    //  -----

    //  DYNAMIC PAGES
    const { id } = params
    const res = await fetch(`https://impactmarket-api-staging.herokuapp.com/api/v2/communities/${id}`)
    const community = await res.json()
    //  -----

    return {
        props: {
            communityId: community.data.id,
            data,
            view: 'requests'
        },
        revalidate: 10
    };
};

export default SingleRequest;
