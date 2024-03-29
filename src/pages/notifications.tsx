import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Notifications from '../views/Notifications';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: ['pwa-view-notifications', 'push_notifications_data']
    });

    return {
        props: {
            data,
            view: 'notifications',
            withPreview: !!previewData
        }
    };
};

export default Notifications;
