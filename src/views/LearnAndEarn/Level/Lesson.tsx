import {
    Box,
    Button,
    Display,
    Divider,
    Label,
    OptionItem,
    Pagination,
    Text,
    ViewContainer,
    openModal,
    toast
} from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Message from '../../../libs/Prismic/components/Message';
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import Video from '../Video';
import config from '../../../../config';
import useFilters from '../../../hooks/useFilters';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const initialAnswers = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

const QUIZ_LENGTH = 3;

const Lesson = (props: any) => {
    const { prismic, lang, params } = props;
    const { prismicLesson } = prismic;
    const {
        tutorial: content,
        questions,
        sponsor,
        readTime,
        id
    } = prismicLesson;
    const { t } = useTranslations();
    const { viewLearnAndEarn } = usePrismicData().data as any;
    const { startQuiz, completeContent, sponsored } = viewLearnAndEarn.data;
    const { update, getByKey } = useFilters();
    const [currentPage, setCurrentPage] = useState(
        getByKey('page') ? +getByKey('page') : 0
    );
    const [isQuiz, setIsQuiz] = useState(false);
    const auth = useSelector(selectCurrentUser);
    const router = useRouter();
    const [progress, setProgress] = useState([currentPage]);
    const [userAnswers, setUserAnswers] = useState(initialAnswers);

    const canGotoQuiz = progress.length === content.length;

    const slide =
        content[currentPage]?.slice_type === 'video_section'
            ? content[currentPage] ?? {}
            : content[currentPage]?.primary?.content ?? {};

    const currentQuestion = questions[currentPage];

    //  Handle Pagination
    const handlePageClick = (event: any, direction?: number) => {
        const currentPage = getByKey('page') ? +getByKey('page') : 0;
        let page = currentPage;

        if (event.selected >= 0) {
            update({ page: event.selected });
            page = event.selected;
        } else if (direction === 1 && currentPage > 0) {
            page = currentPage - 1;
            update({ page });
        } else if (direction === 2 && currentPage <= content?.length) {
            page = currentPage + 1;
            update({ page });
        }

        if (!isQuiz && ![...new Set(progress)].includes(page)) {
            setProgress([...progress, page]);
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
            if (slide[0].type === 'image') {
                return <RichText content={slide} w="100%" />;
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
                        router.push(`/${lang}/learn-and-earn/${params.level}`)
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

            <Box flex>
                <RichText content={readTime} g500 small />
                <RichText content={` - ${sponsored} `} g500 small />

                <RichText content={sponsor} g500 small />
            </Box>

            <Divider />
            <Box
                flex
                fDirection="column"
                style={{ alignItems: 'center', position: 'relative' }}
            >
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
                                        temp[currentPage][idx] =
                                            !temp[currentPage][idx];
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

                {!isQuiz && currentPage + 1 === content.length && (
                    <Box mt="1rem">
                        <Button
                            disabled={!canGotoQuiz}
                            fluid
                            secondary
                            xl
                            onClick={() => toggleQuiz(true)}
                        >
                            <RichText content={startQuiz} />
                        </Button>
                    </Box>
                )}

                {!canGotoQuiz && currentPage + 1 === content.length && (
                    <Text pt="1rem" g500 small>
                        <RichText content={completeContent} />
                    </Text>
                )}

                {isQuiz && currentPage + 1 === QUIZ_LENGTH && (
                    <Box mt="1rem">
                        <Button
                            fluid
                            secondary
                            xl
                            disabled={!(progress.length == content.length)}
                            onClick={async () => {
                                // Post answers
                                const answers = userAnswers
                                    .reduce((next: any, current: any) => {
                                        return [
                                            current.findIndex((el: any) => el),
                                            ...next
                                        ];
                                    }, [])
                                    .reverse();

                                const res = await fetch(
                                    `${config.baseApiUrl}/learn-and-earn/lessons`,
                                    {
                                        body: JSON.stringify({
                                            answers,
                                            lesson: id
                                        }),
                                        headers: {
                                            Accept: 'application/json',
                                            Authorization: `Bearer ${auth.token}`,
                                            'Content-Type': 'application/json'
                                        },
                                        method: 'PUT'
                                    }
                                );

                                const response = await res.json();

                                if (response?.data?.success === false) {
                                    openModal('laeFailedLesson', {
                                        attempts: response?.data?.attempts,
                                        onClose: () => {
                                            toggleQuiz(false);
                                            setUserAnswers(initialAnswers);
                                        }
                                    });
                                } else if (response?.data?.success) {
                                    openModal('laeSuccessLesson', {
                                        onClose: () =>
                                            router.push(
                                                `/${lang}/learn-and-earn/${params.level}`
                                            )
                                    });
                                } else {
                                    toast.error(<Message id="errorOccurred" />);
                                }
                            }}
                        >
                            {t('submit')}
                        </Button>
                    </Box>
                )}

                <Box w="100%">
                    <Divider />
                    <Box>
                        <Pagination
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            mt={2}
                            mobileText
                            nextIcon="arrowRight"
                            nextLabel={t('next')}
                            pageCount={isQuiz ? QUIZ_LENGTH : content.length}
                            pb={2}
                            previousIcon="arrowLeft"
                            previousLabel={t('previous')}
                        />
                    </Box>
                </Box>
            </Box>
        </ViewContainer>
    );
};

export default Lesson;
