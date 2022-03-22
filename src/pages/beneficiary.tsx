import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Beneficiary from '../views/Beneficiary';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    console.log("hello4");
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-beneficiary' });

    return {
        props: {
            data,
            view: 'beneficiary'
        }
    };
};

export default Beneficiary;
