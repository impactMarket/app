import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Home from '../app/views/Home';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-beneficiary' });

    return {
        props: {
            data,
            view: 'beneficiary'
        }
    };
};

export default Home;
