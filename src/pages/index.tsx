import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Home from '../views/Home';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-shortcuts'
    });

    return {
        props: {
            data,
            view: 'shortcuts',
            withPreview: !!previewData
        }
    };
};

export default Home;
