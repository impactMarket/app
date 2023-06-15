import { ClientConfig } from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '../../libs/Prismic/Prismic';
import User from '../../views/User';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = () => {
    return {
        fallback: 'blocking',
        paths: []
    };
};

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-user'
    });

    return {
        props: {
            data,
            view: 'user',
            withPreview: !!previewData
        }
    };
};

export default User;
