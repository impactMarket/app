import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Managers from '../../views/Managers';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-manager-managers'
    });

    return {
        props: {
            data,
            view: 'managerManagers',
            withPreview: !!previewData
        }
    };
};

export default Managers;
