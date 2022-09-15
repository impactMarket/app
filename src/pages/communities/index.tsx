import { GetStaticProps } from "next"

import { ClientConfig } from "@prismicio/client"

import Communities from "../../views/Communities"
import Prismic from "../../libs/Prismic/Prismic"
import config from '../../../config';

const fetcher = (url: string) => fetch(config.baseApiUrl + url).then((res) => res.json());

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-communities' });
    const communities = await fetcher('/communities?ambassadorAddress=&country=&limit=8&name=&offset=0&orderBy=bigger:DESC&status=valid');
    const claimsArray = await fetcher(`/claims-location`);
    const communitiesCountries = await fetcher(`/communities/count?groupBy=country&status=valid`);

    return {
        props: {
            data,
            fallback: {
                '/claims-location': claimsArray,
                '/communities/count?groupBy=country&status=valid': communitiesCountries,
                '/communities?ambassadorAddress=&country=&limit=8&name=&offset=0&orderBy=bigger:DESC&status=valid': communities
            },
            view: 'communities',
            withPreview: !!previewData
        }
    };
};

export default Communities;
