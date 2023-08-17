// import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import ApplicationForm from 'src/views/MicroCredit/Application';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    // const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        lang,
        types: ['pwa-view-application']
    });

    return {
        props: {
            data,
            fallback: '',
            lang,
            readOnly: false,
            view: 'view-application',
            withPreview: !!previewData
        }
    };
};

export default ApplicationForm;
