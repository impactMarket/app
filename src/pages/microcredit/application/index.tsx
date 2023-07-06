// import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import ApplicationForm from 'src/views/MicroCredit/Apllication';
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
            view: 'Application',
            withPreview: !!previewData
        }
    };
};

export default ApplicationForm;
