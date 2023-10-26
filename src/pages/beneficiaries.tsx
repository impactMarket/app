import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import Beneficiaries from '../views/Beneficiaries';
import Prismic from '../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-manager-beneficiaries'
    });

    return {
        props: {
            data,
            view: 'managerBeneficiaries',
            withPreview: !!previewData
        }
    };
};

export default Beneficiaries;
