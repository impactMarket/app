import { Button, ComposedCard, Grid } from '@impact-market/ui';
import { ctaText } from "./Helpers";
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

const ClickableCard = styled(ComposedCard)`
    cursor: pointer;
`;

const LevelsTable = (props: any) => {
    const { data, categories, pageStart, pageEnd, lang } = props;
    const router = useRouter();

    return (
        <Grid colSpan={1.5} cols={{ lg: 3, xs: 1 }}>
        {data &&
            data
                .slice(pageStart, pageEnd)
                .map((elem: any) => {
                    return (
                        <ClickableCard
                            heading={elem?.title || ''}
                            content={`${elem?.totalLessons} lessons`}
                            image={elem.data?.image?.url}
                            label={
                                categories[elem?.category]?.title
                            }
                            // ADD ON UI SIDE
                            // onClick={() =>
                            //     router.push(
                            //         `/${lang}/learn-and-earn/${
                            //             elem?.uid
                            //         }${
                            //             elem?.id
                            //                 ? `?levelId=${elem?.id}`
                            //                 : ''
                            //         }`
                            //     )
                            // }
                        >
                            <Button 
                                fluid
                                onClick={() =>
                                    router.push(
                                        `/${lang}/learn-and-earn/${
                                            elem?.uid
                                        }${
                                            elem?.id
                                                ? `?levelId=${elem?.id}`
                                                : ''
                                        }`
                                    )
                                }
                                secondary 
                                xl
                            >
                                {ctaText(elem.status, elem.totalReward)}
                            </Button>
                        </ClickableCard>
                    );
                })}
    </Grid>
    )
};

export default LevelsTable;