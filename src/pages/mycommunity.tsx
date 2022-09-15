import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import MyCommunity from '../views/MyCommunity';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-my-community' });

    return {
        props: {
            data,
            view: 'myCommunity',
            withPreview: !!previewData
        }
    };
};

export default MyCommunity;
