import {
    Box,
    Button,
    Display,
    Divider,
    Label,
    OptionItem,
    Pagination,
    ViewContainer,
    openModal
} from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import Video from '../Video';
import config from '../../../../config';
import useFilters from '../../../hooks/useFilters';

const initialAnswers = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

const Lesson = (props: any) => {
    const { prismic, lang, params } = props;
    const { prismicLesson } = prismic;
    const { tutorial: content, questions } = prismicLesson;
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(
        getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0
    );
    const [isQuiz, setIsQuiz] = useState(false);
    const auth = useSelector(selectCurrentUser);
    const lessonId = getByKey('id') ? +getByKey('id') : null;
    const levelId = +getByKey('levelId') || null;
    const router = useRouter();

    const [userAnswers, setUserAnswers] = useState(initialAnswers);

    const slide =
        content[currentPage].slice_type === 'video_section'
            ? content[currentPage]
            : content[currentPage].primary.content;
    const currentQuestion = questions[currentPage];

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = getByKey('page')
            ? parseInt(getByKey('page')[0], 10)
            : 0;
        let page = currentPage;

        if (event.selected >= 0) {
            update({ page: event.selected });
            page = event.selected;
        } else if (direction === 1) {
            page = currentPage - 1;
            update({ page });
        } else if (direction === 2) {
            page = currentPage + 1;
            update({ page });
        }

        setCurrentPage(page);
    };

    const toggleQuiz = (isQuiz: boolean) => {
        setIsQuiz(isQuiz);
        update({ page: 0 });
        setCurrentPage(0);
    };

    const ContentDisplay = (props: any) => {
        const { slide } = props;

        if (slide[0]?.type) {
            if (
                (slide.length === 1 && slide[0].type === 'preformatted') ||
                slide[0].type === 'image'
            ) {
                return <RichText content={slide} />;
            }

            return (
                <Box maxW="36.25rem" w="100%">
                    <RichText content={slide} pb=".5rem" />
                </Box>
            );
        }
        if (slide.slice_type === 'video_section') {
            return (
                <Box maxW="100%" flex style={{ justifyContent: 'center' }}>
                    <Video {...slide} />
                </Box>
            );
        }

        return <></>;
    };

    return (
        <ViewContainer>
            {!isQuiz && (
                <Box
                    as="a"
                    onClick={() =>
                        router.push(
                            `/${lang}/learn-and-earn/${params.level}?levelId=${levelId}`
                        )
                    }
                >
                    <Label
                        content={<String id="back" />}
                        icon="arrowLeft"
                        mb="1rem"
                    />
                </Box>
            )}
            <Display g900 medium mb=".25rem">
                {prismicLesson.title}
            </Display>

            <RichText
                content={'1 min read - Beginner - Sponsored by XXX'}
                g500
                small
            />

            <Divider />
            <Box
                flex
                fDirection="column"
                style={{ alignItems: 'center', position: 'relative' }}
            >
                {/* <Box maxW="100%" flex style={{justifyContent: 'center'}}> */}
                {!isQuiz ? (
                    <ContentDisplay slide={slide} />
                ) : (
                    <Box
                        maxW="36.25rem"
                        flex
                        style={{ justifyContent: 'center' }}
                        fDirection="column"
                        w="100%"
                        mt="2.5rem"
                    >
                        <RichText
                            content={currentQuestion.primary.question[0].text}
                            g900
                            medium
                            pb="1rem"
                        />

                        {currentQuestion.items.map((item: any, idx: number) => {
                            const question = item.answer[0];
                            const temp = [...userAnswers];

                            return (
                                <Box
                                    mb=".75rem"
                                    onClick={() => {
                                        temp[currentPage] = [
                                            false,
                                            false,
                                            false
                                        ];
                                        temp[currentPage][idx] = !temp[
                                            currentPage
                                        ][idx];
                                        setUserAnswers(temp);
                                    }}
                                >
                                    <OptionItem
                                        content={question.text}
                                        isActive={userAnswers[currentPage][idx]}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
                {/* </Box> */}

                {currentPage + 1 === content.length && (
                    <Box mt="1rem">
                        <Button
                            fluid
                            secondary
                            xl
                            onClick={() => toggleQuiz(true)}
                        >
                            {`Start Quiz`}
                        </Button>
                    </Box>
                )}

                {isQuiz && currentPage + 1 >= 3 && (
                    <Box mt="1rem">
                        <Button
                            fluid
                            secondary
                            xl
                            onClick={async () => {
                                if (!isQuiz) {
                                    setIsQuiz(true);
                                    update({ page: 0 });
                                    setCurrentPage(0);
                                } else {
                                    // Post answers
                                    const answers = userAnswers
                                        .reduce((next: any, current: any) => {
                                            return [
                                                current.findIndex(
                                                    (el: any) => el
                                                ),
                                                ...next
                                            ];
                                        }, [])
                                        .reverse();

                                    const res = await fetch(
                                        `${config.baseApiUrl}/learn-and-earn/lessons`,
                                        {
                                            body: JSON.stringify({
                                                answers,
                                                lesson: lessonId
                                            }),
                                            headers: {
                                                Accept: 'application/json',
                                                Authorization: `Bearer ${auth.token}`,
                                                'Content-Type':
                                                    'application/json'
                                            },
                                            method: 'PUT'
                                        }
                                    );

                                    const response = await res.json();

                                    if (response?.data?.success === false) {
                                        openModal('wrongAnswer', {
                                            attempts: response?.data?.attempts,
                                            onClose: () => {
                                                toggleQuiz(false);
                                                setUserAnswers(initialAnswers);
                                            }
                                        });
                                    } else {
                                        openModal('successModal', {
                                            onClose: () =>
                                                router.push(
                                                    `/${lang}/learn-and-earn/${params.level}?levelId=${levelId}`
                                                )
                                        });
                                    }
                                }
                            }}
                        >
                            {isQuiz ? `Submit` : `Start Quiz`}
                        </Button>
                    </Box>
                )}

                <Box maxW="36.25rem" w="100%">
                    <Divider />
                    <Box maxW="580px" w="100%">
                        <Pagination
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            mt={2}
                            mobileText
                            nextIcon="arrowRight"
                            nextLabel={'Next'}
                            pageCount={isQuiz ? 3 : content.length}
                            pb={2}
                            previousIcon="arrowLeft"
                            previousLabel="Previous"
                        />
                    </Box>
                </Box>
            </Box>
        </ViewContainer>
    );
};

export default Lesson;
