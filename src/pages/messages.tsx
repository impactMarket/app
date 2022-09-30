import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Messages from '../views/Messages';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    // TODO create messages view on Prismic
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-messages'
    });

    return {
        props: {
            data,
            view: 'messages',
            withPreview: !!previewData
        }
    };
};

export default Messages;
