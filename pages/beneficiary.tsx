import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Beneficiary from '../app/views/Beneficiary';
import Prismic from '../libs/Prismic/Prismic';
import getTypesToFetchWithConfigs from '../libs/Prismic/helpers/getTypesToFetchWithConfigs';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const types = getTypesToFetchWithConfigs(['pwa-view-beneficiary']);

    const data = await Prismic.getByTypes({ clientOptions, lang, types });

    return {
        props: {
            data,
            view: 'beneficiary'
        }
    };
};

export default Beneficiary;
