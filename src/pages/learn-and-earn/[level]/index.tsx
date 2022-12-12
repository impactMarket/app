// import { ClientConfig } from '@prismicio/client';
import { ClientConfig } from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Level from '../../../views/LearnAndEarn/Level';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticPaths: GetStaticPaths = () => {
    return {
        fallback: 'blocking',
        paths: []
    };
};

export const getStaticProps: GetStaticProps = async ({
    locale: lang,
    previewData,
    params
}) => {
    const clientOptions = previewData as ClientConfig;
    const { level } = params;

    const prismicLevel = await Prismic.getLevelByUID({
        clientOptions,
        lang,
        level
    });

    if (!prismicLevel) {
        return {
            props: {},
            redirect: {
                destination: '/learn-and-earn'
            }
        };
    }

    const categories = await Prismic.getAllCategories({
        clientOptions,
        lang,
        types: 'pwa-lae-category'
    });

    const lessonIds = prismicLevel.data.lessons.map(
        (current: any) => current.lesson.id
    );

    const lessons = await Prismic.getLessonsByIDs({
        clientOptions,
        lang,
        lessonIds
    });

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-view-learn-and-earn'
    });

    return {
        props: {
            data,
            fallback: '',
            lang,
            params,
            prismic: {
                categories,
                lessons,
                level: prismicLevel
            },
            view: 'LearnAndEarn'
            // withPreview: !!previewData
        }
    };
};

export default Level;
