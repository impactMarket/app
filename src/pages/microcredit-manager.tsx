import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import MicrocreditManager from '../views/MicrocreditManager/MicrocreditManager';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-microcredit-manager' });

    return {
        props: {
            data,
            view: 'microcreditManager',
            withPreview: !!previewData
        }
    };
};

export default MicrocreditManager;
