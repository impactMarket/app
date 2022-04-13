import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Requests from '../../views/Requests';
import Prismic from '../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-requests' });

    return {
        props: {
            data,
            view: 'requests'
        }
    };
};

export default Requests;