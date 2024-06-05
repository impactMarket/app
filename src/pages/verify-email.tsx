import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import VerifyEmail from 'src/views/VerifyEmail';

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
