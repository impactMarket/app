import { Button, ComposedCard, Grid } from '@impact-market/ui';
import { ctaText } from './Helpers';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import React from 'react';
import styled from 'styled-components';

const ClickableCard = styled(ComposedCard)`
    cursor: pointer;
`;

const LevelsTable = (props: any) => {
    const { data, categories, pageStart, pageEnd, lang } = props;
    const router = useRouter();
    const auth = useSelector(selectCurrentUser);
    const isEligible = !auth?.type
        ? false
        : auth.type.some((r: any) => ['beneficiary', 'manager'].includes(r));

    return (
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
                                    `/${lang}/learn-and-earn/${
                                        elem?.uid
                                    }${
                                        elem?.id && isEligible
                                            ? `?levelId=${elem?.id}`
                                            : ''
                                    }`
                                )
                            }
                        >
                            <Button
                                fluid
                                secondary
                                xl
                            >
                                {ctaText(elem.status, elem.totalReward)}
                            </Button>
                        </ClickableCard>
                    );
                })}
        </Grid>
    );
};

export default LevelsTable;
