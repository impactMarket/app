// import { ClientConfig } from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Lesson from '../../../../views/LearnAndEarn/Level/Lesson';
import Prismic from '../../../../libs/Prismic/Prismic';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = (slug) => {
    return {
        fallback: 'blocking',
        paths: []
    };
};

export const getStaticProps: GetStaticProps = async (props) => {
   const { lesson } = props.params;
   const levelsID = await Prismic.getLessonByUID({ lang: props.locale, lesson });

  //  if (!levelsID) {
  //   return {
  //     redirect: {
  //       destination: "/learn-and-earn",
  //     },
  //     props: {}
  //   }
  // }

//    console.log(levelsID);
   

   return {
    props: {
        fallback: '',
        prismic: {
            levelsID
        },
        view: 'managerDashboard',
        // withPreview: !!previewData
    }
};
};

export default Lesson;