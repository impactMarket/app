import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Ambassador from '../../views/Ambassador';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-ambassador' });

    return {
        props: {
            data,
            view: 'ambassador'
        }
    };
};

export default Ambassador;
