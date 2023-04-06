import {
    Alert,
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
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import Tooltip from '../../../components/Tooltip';
import config from '../../../../config';
import useFilters from '../../../hooks/useFilters';
import useLessons from '../../../hooks/learn-and-earn/useLessons';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

import styled from 'styled-components';

const Cell = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: none;
    justify-content: center;
`;

const Level = (props: any) => {
    const { prismic, params, lang, data } = props;
    const view = data['view-learn-and-earn'];
    const { level, lessons, categories } = prismic;
    const { title, category } = level.data;
    const { t } = useTranslations();
    const { instructions, thresholdTooltip } = view.data;
    const { text: tooltip } = thresholdTooltip[0];
    const auth = useSelector(selectCurrentUser);
    const { getByKey } = useFilters();
    const levelId = getByKey('levelId') || '';
    const { data: lessonsData, totalPoints, completedToday, rewardAvailable } = useLessons(
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

    const isLAEUSer = auth?.user?.roles?.some((r: string) => ['beneficiary', 'manager'].includes(r));
    const tooltipText = !isLAEUSer ? 'Learn&Earn lessons are ONLY available for impactMarket UBI beneficiaries.' : tooltip;
    const buttonDisabled = isLAEUSer || !completedToday;

    return (
        <ViewContainer isLoading={false}>
            <Box as="a" onClick={() => router.push(`/${lang}/learn-and-earn/`)}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>

            {!rewardAvailable && (
                <Box mt="1rem" >
                    <Alert
                        error
                        icon="alertCircle"
                        message="There are no rewards available for this level."
                        title="No rewards available"
                    />
                </Box>
            )}

            <Display g900 medium mt="1rem" mb=".5rem">
                {title}
            </Display>

            <RichText content={categories[category?.id]?.title} g500 />
            <Divider />

            <Box flex style={{ justifyContent: 'center' }}>
                <Box maxW="36.25rem">
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
                                <Box
                                    style={{
                                        columnGap: '1rem',
                                        justifyContent: 'space-between'
                                    }}
                                    flex
                                >
                                    <Box fGrow="1">
                                        <RichText
                                            content={item.title.split(' -')[0]}
                                            g500
                                            bold
                                        />

                                        <RichText
                                            content={item.title.split('- ')[1]}
                                            g500
                                        />
                                    </Box>
                                    <Cell>
                                        {'10 points'}
                                    </Cell>
                                    <Cell>
                                        {item.status === 'started' && (
                                            <Tooltip
                                                content={tooltip}
                                                disabledTooltip={!completedToday}
                                            >
                                                <Button
                                                    fluid
                                                    disabled={
                                                        (idx - 1 >= 0 &&
                                                            lessonsData[idx - 1]
                                                                ?.status !==
                                                                'completed') ||
                                                        completedToday
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            `/${lang}/learn-and-earn/${params.level}/${item.uid}?id=${item.backendId}&levelId=${levelId}`
                                                        )
                                                    }
                                                >
                                                    <String id="continue" />
                                                </Button>
                                            </Tooltip>
                                        )}

                                        {(item.status === 'available' || !isLAEUSer) &&
                                            (idx - 1 < 0 ||
                                                lessonsData[idx - 1]?.status ===
                                                    'completed') && (
                                                <Tooltip
                                                    content={tooltipText}
                                                    disabledTooltip={buttonDisabled}
                                                >
                                                    <Button
                                                        fluid
                                                        disabled={
                                                            completedToday || !isLAEUSer
                                                        }
                                                        onClick={() =>
                                                            startLesson(
                                                                item.backendId,
                                                                item.uid
                                                            )
                                                        }
                                                    >
                                                        {'Start Lesson'}
                                                    </Button>
                                                </Tooltip>
                                            )}

                                        {item.status === 'completed' && (
                                            <Badge bgS50 s700>
                                                {t('completed')}
                                                <Icon icon="check" s700 />
                                            </Badge>
                                        )}
                                    </Cell>
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
