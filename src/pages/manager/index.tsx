import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Manager from '../../views/Manager';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-manager-dashboard' });

    return {
        props: {
            data,
            view: 'managerDashboard',
            withPreview: !!previewData
        }
    };
};

export default Manager;
