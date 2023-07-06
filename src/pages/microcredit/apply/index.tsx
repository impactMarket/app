import { GetStaticProps } from 'next';
import Apply from 'src/views/MicroCredit/Apply';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData
}) => {
    const data = await Prismic.getByTypes({ lang, types: ['pwa-view-apply'] });

    return {
        props: {
            data,
            fallback: '',
            lang,
            view: 'view-apply',
            withPreview: !!previewData
        }
    };
};

export default Apply;
