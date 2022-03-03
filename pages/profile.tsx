import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Prismic from '../libs/Prismic/Prismic';
import Profile from '../app/views/Profile';
import getTypesToFetchWithConfigs from '../libs/Prismic/helpers/getTypesToFetchWithConfigs';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const types = getTypesToFetchWithConfigs(['pwa-view-profile']);

    const data = await Prismic.getByTypes({ clientOptions, lang, types });

    return {
        props: {
            data,
            view: 'profile'
        }
    };
};

export default Profile;
