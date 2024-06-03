import { GetStaticProps } from 'next';
import Pact from '../../../views/Pact';
import Prismic from '../../../libs/Prismic/Prismic';

const fetcher = async (params: any) => await Prismic.getByTypes(params);

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const data = await fetcher({
        lang,
        types: ['pwa-view-learn-and-earn']
    });

    return {
        props: {
            data,
            fallback: '',
            lang,
            view: 'LearnAndEarn',
            withPreview: !!previewData
        }
    };
};

export default Pact;
