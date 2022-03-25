import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import Settings from '../views/settings/Settings';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-settings' });

    return {
        props: {
            data,
            view: 'settings'
        }
    };
};

export default Settings;
