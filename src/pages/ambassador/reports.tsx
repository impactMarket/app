import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../../libs/Prismic/Prismic';
import Reports from '../../views/Ambassador/Reports';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-ambassador' });

    return {
        props: {
            data,
            view: 'ambassador',
            withPreview: !!previewData
        }
    };
};

export default Reports;
