import { ClientConfig } from '@prismicio/client';
import { GetStaticProps, GetStaticPaths } from 'next';
import Requests from '../../views/Requests/[id]';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-requests' });

    return {
        props: {
            data,
            view: 'requests'
        }
    };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}

export default Requests;