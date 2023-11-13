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
import GenerateCertificate from 'learn-and-earn-submodule/components/GenerateCertificate';
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import Tooltip from '../../../components/Tooltip';
import config from '../../../../config';
import styled from 'styled-components';
import useLessons from 'learn-and-earn-submodule/hooks/useLessons';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

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
    const { title, category, sponsor } = level.data;
    const { t } = useTranslations();
    const {
        cardHeading,
        cardTip,
        certificateCompletedOn,
        certificateHeading,
        certificateSupportText,
        dismiss,
        downloadCertificate,
        firstNamePlaceholder,
        generate,
        instructions,
        lastNamePlaceholder,
        noRewardsTooltip,
        noRewardsTooltipTitle,
        on,
        onlyBeneficiariesTooltip,
        startLesson: startLessonLabel,
        thresholdTooltip,
        totalPoints: totalPointsLabel,
        viewCertificate
    } = view.data;

    const { text: tooltip } = thresholdTooltip[0];

    const cardData = {
        cardHeading,
        cardTip,
        certificate: {
            completedOn: certificateCompletedOn,
            heading: certificateHeading,
            on,
            supportText: certificateSupportText
        },
        dismiss,
        downloadCertificate,
        firstNamePlaceholder,
        generate,
        lastNamePlaceholder,
        viewCertificate
    };

    const auth = useSelector(selectCurrentUser);
    const {
        data: lessonsData,
        totalPoints,
        completedToday,
        rewardAvailable = true
    } = useLessons(lessons, level?.id, lang, config.baseApiUrl, auth?.token);

    const certificateDetails = !!lessonsData && {
        ...cardData,
        completionDate: lessonsData[lessonsData?.length - 1]?.completionDate,
        sponsor: sponsor?.url,
        title
    };

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
                router.push(`/${lang}/learn-and-earn/${params.level}/${uid}`);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const isLAEUSer = auth?.user?.roles?.some((r: string) =>
        ['beneficiary', 'manager'].includes(r)
    );
    const tooltipText = !isLAEUSer ? onlyBeneficiariesTooltip : tooltip;
    const buttonDisabled = isLAEUSer && !completedToday;

    return (
        <ViewContainer {...({} as any)} isLoading={false}>
            <Box as="a" onClick={() => router.push(`/${lang}/learn-and-earn/`)}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>

            {!rewardAvailable && (
                <Box mt="1rem">
                    <Alert
                        error
                        icon="alertCircle"
                        message={noRewardsTooltip}
                        title={noRewardsTooltipTitle}
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
                    <RichText content={instructions} g500 mb={1} />

                    {!!certificateDetails?.completionDate && (
                        <GenerateCertificate {...certificateDetails} />
                    )}

                    <Box margin="1rem 0">
                        <RichText content={totalPointsLabel} g500 small />

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
                                    <Cell>{'10 points'}</Cell>
                                    <Cell>
                                        {item.status === 'started' && (
                                            <Tooltip
                                                content={tooltip}
                                                disabledTooltip={buttonDisabled}
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
                                                            `/${lang}/learn-and-earn/${params.level}/${item.uid}`
                                                        )
                                                    }
                                                >
                                                    <String id="continue" />
                                                </Button>
                                            </Tooltip>
                                        )}

                                        {(item.status === 'available' ||
                                            !isLAEUSer) &&
                                            (idx - 1 < 0 ||
                                                lessonsData[idx - 1]?.status ===
                                                    'completed') && (
                                                <Tooltip
                                                    content={tooltipText}
                                                    disabledTooltip={
                                                        buttonDisabled
                                                    }
                                                >
                                                    <Button
                                                        fluid
                                                        disabled={
                                                            completedToday ||
                                                            !isLAEUSer
                                                        }
                                                        onClick={() =>
                                                            startLesson(
                                                                item.id,
                                                                item.uid
                                                            )
                                                        }
                                                    >
                                                        {startLessonLabel}
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
