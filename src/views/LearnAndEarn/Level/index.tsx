import {
    Badge,
    Box,
    Button,
    Display,
    Divider,
    Icon,
    // TextLink,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import RichText from '../../../libs/Prismic/components/RichText';
import config from '../../../../config';
import useFilters from '../../../hooks/useFilters';
import useLessons from '../../../hooks/learn-and-earn/useLessons';

const Level = (props: any) => {
    const { prismic, params, lang } = props;
    const { level, lessons } = prismic;
    const { title } = level.data;
    const auth = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const levelId = getByKey('id') || '';
    const { data: lessonsTest } = useLessons(lessons, levelId, auth);
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
                    method: 'POST',
                }
            );

            const response = await res.json();

            if (response?.success) {
                router.push(
                    `/${lang}/learn-and-earn/${params.level}/${uid}?id=${lessonId}`
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
            <Display g900 medium mb=".5rem">
                {title}
            </Display>

            <RichText content={'Beginner'} g500 />
            <Divider />

            <Box flex style={{ justifyContent: 'center' }}>
                <Box maxW="580px">
                    <RichText
                        content={
                            'After each lesson you will be prompt to answer a simple quiz based on what you have learned. For every successful quiz, you will receive $PACT tokens in your Libera wallet.'
                        }
                        g500
                    />

                    <RichText
                        content={
                            'After 3 attempts to answer a quiz and the result is still wrong, you will not be able to earn rewards but will still be able to learn. Learn all the rules....'
                        }
                        g500
                        bold
                        mt="1rem"
                    />

                    <Box margin="1rem 0">
                        <RichText content={'TotAL Points'} g500 small />

                        <Display g900 medium bold>
                            {0}
                        </Display>
                    </Box>

                    <Divider mt="2rem" />

                    {lessonsTest?.map((item: any, idx: number) => {
                        console.log(item);

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
                                        {/* {item.status === 'started' && (idx - 1 < 0 || lessonsTest[idx-1]?.status === 'completed') && 'cenas'} */}
                                        {item.status === 'started' && (
                                            <Button
                                                fluid
                                                disabled={((idx - 1 >= 0 && lessonsTest[idx-1]?.status !== 'completed'))}
                                                onClick={() =>
                                                    router.push(
                                                        `/${lang}/learn-and-earn/${params.level}/${item.uid}?id=${item.backendId}`
                                                    )
                                                }
                                            >
                                                {'Continue'}
                                            </Button>
                                        )}

                                        {item.status === 'available' && (idx - 1 < 0 || lessonsTest[idx-1]?.status === 'completed') && (
                                            <Button
                                                fluid
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
                                            <Badge bgS50 s700>
                                                {'Completed '}
                                                <Icon icon="check" s700 />
                                            </Badge>
                                        )}

                                        {/* {--idx >= 0 && lessonsTest[idx-1]?.status !== 'completed' && !!item.status && (
                                            <Button
                                                fluid
                                                disabled
                                            >
                                                {'Continue'}
                                            </Button>
                                        )} */}
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
