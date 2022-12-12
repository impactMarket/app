import { ClientConfig } from '@prismicio/client';
import { GetStaticProps } from 'next';
import LearnAndEarn from '../../views/LearnAndEarn';
import Prismic from '../../libs/Prismic/Prismic';

const fetcher = async (params: any) => await Prismic.getByTypes(params);

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const clientOptions = previewData as ClientConfig;
    const categories = await Prismic.getAllCategories({ clientOptions, lang, types: 'pwa-lae-category' });
    const levels = await Prismic.getAllLevels({ clientOptions, document: 'pwa-lae-level', lang });
    const data = await fetcher({ lang, types: 'pwa-lae-category' });

    return {
        props: {
            data,
            fallback: '',
            lang,
            prismic: {
                categories,
                levels
            },
            view: 'LearnAndEarn',
            // withPreview: !!previewData
        }
    };
};

export default LearnAndEarn;
