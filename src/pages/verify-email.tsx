import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import VerifyEmail from 'src/views/VerifyEmail';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-beneficiary'
    });

    return {
        props: {
            data,
            view: 'beneficiary',
            withPreview: !!previewData
        }
    };
};

export default VerifyEmail;
