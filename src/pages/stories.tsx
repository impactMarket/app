import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import Stories from '../views/Stories';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-stories'
    });

    return {
        props: {
            data,
            view: 'stories'
        }
    };
};

export default Stories;
