import {
    Box,
    Button,
    CircledIcon,
    ComposedCard,
    Grid,
    Text
} from '@impact-market/ui';
import { ctaText } from './Helpers';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import styled from 'styled-components';

const ClickableCard = styled(ComposedCard)`
    cursor: pointer;
`;

const LevelsTable = (props: any) => {
    const { data, categories, pageStart, pageEnd, lang } = props;
    const router = useRouter();
    const auth = useSelector(selectCurrentUser);
    const isLAEUser = auth?.type?.some((r: any) => ['beneficiary', 'manager'].includes(r)) ?? false;

    const isEligible = !auth?.type
        ? false
        : isLAEUser;

    return (
        <>
            <Grid colSpan={1.5} cols={{ lg: 3, xs: 1 }}>
                {data &&
                    data.slice(pageStart, pageEnd).map((elem: any) => {
                        return (
                            <ClickableCard
                                heading={elem?.title || ''}
                                content={`${elem?.totalLessons} lessons`}
                                image={elem.data?.image?.url}
                                label={categories[elem?.category]?.title}
                                onClick={() =>
                                    router.push(
                                        `/${lang}/learn-and-earn/${elem?.uid}${
                                            elem?.id && isEligible
                                                ? `?levelId=${elem?.id}`
                                                : ''
                                        }`
                                    )
                                }
                            >
                                <Button fluid secondary xl>
                                    {ctaText(elem.status, elem.totalReward, isLAEUser)}
                                </Button>
                            </ClickableCard>
                        );
                    })}
            </Grid>

            {!data.length && (
                <Box column fLayout="center" flex w="100%" mt="2rem">
                    <CircledIcon icon="forbidden" medium />

                    <Text g500 medium mt={1}>
                        <String id="noRecordsFounds" />
                    </Text>
                </Box>
            )}
        </>
    );
};

export default LevelsTable;
