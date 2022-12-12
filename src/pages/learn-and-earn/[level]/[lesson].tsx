// import { ClientConfig } from '@prismicio/client';
import { ClientConfig } from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Lesson from '../../../views/LearnAndEarn/Level/Lesson';
import Prismic from '../../../libs/Prismic/Prismic';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = (slug) => {
    console.log(slug);
    
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
    
   const { lesson } = params;

   const prismicLesson = await Prismic.getLessonByUID({ lang, lesson });

    const data = await Prismic.getByTypes({
        clientOptions,
        lang,
        types: 'pwa-lae-lesson'
    });

//    if (!prismicLesson) {
//     return {
//       redirect: {
//         destination: "/learn-and-earn",
//       },
//       props: {}
//     }
//   }

   return {
    props: {
        data,
        fallback: '',
        lang,
        params,
        prismic: {
            prismicLesson
        },
        view: 'managerDashboard',
        // withPreview: !!previewData
    }
};
};

export default Lesson;