import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import AddCommunity from '../../../views/AddCommunity';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-manager-add-community'
    });

    return {
        props: {
            data,
            view: 'managerAddCommunity',
            withPreview: !!previewData
        }
    };
};

export default AddCommunity;
