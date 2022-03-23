import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import Profile from '../views/Profile';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;

    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-profile' });

    return {
        props: {
            data,
            view: 'profile'
        }
    };
};

export default Profile;
