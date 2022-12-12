import {
    Box,
    Button,
    ViewContainer,
    Divider,
    Display,
    openModal,
    OptionItem,
    Pagination,
    ProgressIndicator
} from '@impact-market/ui';
import RichText from '../../../libs/Prismic/components/RichText';
import useFilters from '../../../hooks/useFilters';
import { useState } from 'react';
import config from '../../../../config';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Lesson = (props: any) => {
    const { prismic, lang } = props;
    const { prismicLesson } = prismic;
    const { tutorial: content, questions } = prismicLesson;
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(
        getByKey('page') ? parseInt(getByKey('page')[0], 10) : 0
    );
    const [isQuiz, setIsQuiz] = useState(false);
    const auth = useSelector(selectCurrentUser);
    const lessonId = getByKey('id') ? parseInt(getByKey('id')[0], 10) : null;
    const router = useRouter();

    const [userAnswers, setUserAnswers] = useState([
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ]);

    const slide = content[currentPage].primary.content;

    console.log(content);

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

    return (
        <ViewContainer>
            <Display g900 medium mb=".25rem">
                {prismicLesson.title}
            </Display>

            <RichText
                content={'1 min read - Beginner - Sponsored by XXX'}
                g500
                small
            />

            <Divider />
            <Box flex fDirection="column" style={{ alignItems: 'center' }}>
                <Box maxW="36.25rem" w="100%">
                    <Box
                        margin="2rem 0"
                        flex
                        style={{ justifyContent: 'center' }}
                    >
                        <ProgressIndicator
                            steps={!isQuiz ? content.length : 3}
                            currentStep={currentPage + 1}
                            maxW="350px"
                        />
                    </Box>

                    <Box maxW="100%">
                        {!isQuiz ? (
                            <RichText content={slide} pb=".5rem" />
                        ) : (
                            <>
                                <RichText
                                    content={
                                        questions[currentPage].primary
                                            .question[0].text
                                    }
                                    g900
                                    medium
                                    pb="1rem"
                                />

                                {questions[currentPage].items.map(
                                    (item: any, idx: number) => {
                                        const question = item.answer[0];
                                        const copy = [...userAnswers];

                                        return (
                                            <OptionItem
                                                content={question.text}
                                                isActive={
                                                    userAnswers[currentPage][
                                                        idx
                                                    ]
                                                }
                                                onClick={() => {
                                                    copy[currentPage] = [
                                                        false,
                                                        false,
                                                        false
                                                    ];
                                                    copy[currentPage][
                                                        idx
                                                    ] = !copy[currentPage][idx];
                                                    setUserAnswers(copy);

                                                    return true;
                                                }}
                                            />
                                        );
                                    }
                                )}
                            </>
                        )}
                    </Box>

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
                                            .reduce(
                                                (next: any, current: any) => {
                                                    return [
                                                        current.findIndex(
                                                            (el: any) => el
                                                        ),
                                                        ...next
                                                    ];
                                                },
                                                []
                                            )
                                            .reverse();

                                        const res = await fetch(
                                            `${config.baseApiUrl}/learn-and-earn/lessons/${lessonId}/answers`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    Accept: 'application/json',
                                                    'Content-Type':
                                                        'application/json',
                                                    Authorization: `Bearer ${auth.token}`
                                                },
                                                body: JSON.stringify({
                                                    answers
                                                })
                                            }
                                        );

                                        const response = await res.json();

                                        if (response?.data?.success === false) {
                                            openModal('wrongAnswer', {
                                                onClose: () =>
                                                    toggleQuiz(false),
                                                attempts:
                                                    response?.data?.attempts
                                            });
                                        } else {
                                            openModal('successModal', {
                                                onClose: () =>
                                                    router.push(
                                                        `/${lang}/learn-and-earn/`
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
