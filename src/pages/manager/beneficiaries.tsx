import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Beneficiaries from '../../views/Beneficiaries';
import Prismic from '../../libs/Prismic/Prismic';

// TODO: Load info from the right view

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({ clientOptions, lang, types: 'pwa-view-beneficiaries' });

    return {
        props: {
            data,
            view: 'beneficiaries'
        }
    };
};

export default Beneficiaries;
