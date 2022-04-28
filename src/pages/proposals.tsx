import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import Proposals from '../views/Proposals';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-proposals'
    });

    return {
        props: {
            data,
            view: 'proposals'
        }
    };
};

export default Proposals;
