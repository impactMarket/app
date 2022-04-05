import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import AddCommunity from '../views/AddCommunity';
import Prismic from '../libs/Prismic/Prismic';

// TODO: Load info from the right view

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-add-community' });

    return {
        props: {
            data,
            view: 'add-community'
        }
    };
};

export default AddCommunity;
