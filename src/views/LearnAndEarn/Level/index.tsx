import {
    Badge,
    Box,
    Button,
    Display,
    Divider,
    Icon,
    Label,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import config from '../../../../config';
import useFilters from '../../../hooks/useFilters';
import useLessons from '../../../hooks/learn-and-earn/useLessons';

const Level = (props: any) => {
    const { prismic, params, lang } = props;
    const { level, lessons } = prismic;
    const { title } = level.data;
    const { view } = usePrismicData();
    const { instructions } = view.data;
    const auth = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const levelId = getByKey('levelId') || '';
    const { data: lessonsData, totalPoints } = useLessons(
        lessons,
        levelId,
        auth
    );
    const router = useRouter();

    const startLesson = async (lessonId: number, uid: string) => {
        try {
            const res = await fetch(
                `${config.baseApiUrl}/learn-and-earn/lessons`,
                {
                    body: JSON.stringify({
                        lesson: lessonId
                    }),
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${auth.token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }
            );

            const response = await res.json();

            if (response?.success) {
                router.push(
                    `/${lang}/learn-and-earn/${params.level}/${uid}?id=${lessonId}&levelId=${levelId}`
                );
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ViewContainer isLoading={false}>
            <Box as="a" onClick={() => router.push(`/${lang}/learn-and-earn/`)}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>
            <Display g900 medium mt="1rem" mb=".5rem">
                {title}
            </Display>

            <RichText content={'Beginner'} g500 />
            <Divider />

            <Box flex style={{ justifyContent: 'center' }}>
                <Box maxW="580px">
                    <RichText content={instructions} g500 />

                    <Box margin="1rem 0">
                        <RichText content={'Total Points'} g500 small />

                        <Display g900 medium bold>
                            {totalPoints}
                        </Display>
                    </Box>

                    <Divider mt="2rem" />

                    {lessonsData?.map((item: any, idx: number) => {
                        return (
                            <>
                                <Box flex>
                                    <Box fGrow="1">
                                        <RichText
                                            content={`Lesson ${idx + 1}`}
                                            g500
                                            bold
                                        />

                                        <RichText content={item.title} g500 />
                                    </Box>
                                    <Box
                                        flex
                                        fDirection="column"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        {'10 points'}
                                    </Box>
                                    <Box
                                        flex
                                        fDirection="column"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        {item.status === 'started' && (
                                            <Button
                                                fluid
                                                disabled={
                                                    idx - 1 >= 0 &&
                                                    lessonsData[idx - 1]
                                                        ?.status !== 'completed'
                                                }
                                                ml=".8rem"
                                                onClick={() =>
                                                    router.push(
                                                        `/${lang}/learn-and-earn/${params.level}/${item.uid}?id=${item.backendId}&levelId=${levelId}`
                                                    )
                                                }
                                            >
                                                <String id="continue" />
                                            </Button>
                                        )}

                                        {item.status === 'available' &&
                                            (idx - 1 < 0 ||
                                                lessonsData[idx - 1]?.status ===
                                                    'completed') && (
                                                <Button
                                                    fluid
                                                    ml=".8rem"
                                                    onClick={() =>
                                                        startLesson(
                                                            item.backendId,
                                                            item.uid
                                                        )
                                                    }
                                                >
                                                    {'Start Lesson'}
                                                </Button>
                                            )}

                                        {item.status === 'completed' && (
                                            <Badge bgS50 ml=".8rem" s700>
                                                {'Completed '}
                                                <Icon icon="check" s700 />
                                            </Badge>
                                        )}
                                    </Box>
                                </Box>
                                <Divider />
                            </>
                        );
                    })}
                </Box>
            </Box>
        </ViewContainer>
    );
};

export default Level;
