import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import MicroCredit from 'src/views/MicroCredit';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-microcredit'
    });

    return {
        props: {
            data,
            fallback: '',
            lang,
            view: 'view-microcredit',
            withPreview: !!previewData
        }
    };
};

export default MicroCredit;
