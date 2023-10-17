// import { ClientConfig } from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import ApplicationForm from 'src/views/MicroCredit/Application';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
    return {
        fallback: 'blocking',
        paths: []
    };
};

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData,
    params
}) => {
    const { id } = params;
    // const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        lang,
        types: ['pwa-view-application']
    });

    return {
        props: {
            data,
            fallback: '',
            id,
            lang,
            readOnly: true,
            view: 'view-application',
            withPreview: !!previewData
        }
    };
};

export default ApplicationForm;
