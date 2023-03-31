import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import MicroCredit from 'src/views/MicroCredit';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-micro-credit' });

    return {
        props: {
            data,
            fallback: '',
            lang,
            view: 'view-micro-credit',
            withPreview: !!previewData
        }
    };
};

export default MicroCredit;
