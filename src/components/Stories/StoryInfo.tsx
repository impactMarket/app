import { Box, Button, DropdownMenu, Text, colors } from '@impact-market/ui';
import { mq } from 'styled-gen';
import { useRouter } from 'next/router';
import CanBeRendered from '../CanBeRendered';
import React from 'react';
import String from '../../libs/Prismic/components/String';
import Trim from '../Trim';
import styled, { css } from 'styled-components';
import useFilters from '../../hooks/useFilters';

const GridStyled = styled.div`
    display: grid;
    grid-gap: 1rem;

    .numbers {
        display: flex;

        .dot {
            display: none;
            align-self: center;
            background-color: ${colors.g600};
            border-radius: 50%;
            display: block;
            height: 0.2rem;
            margin: 0 0.3rem;
            width: 0.2rem;
        }
    }

    ${mq.from(
        'xs',
        css`
            grid-template-areas: 'love comment report' 'numbers numbers numbers';
            grid-template-columns: repeat(3, auto);

            .numbers {
                flex-direction: row;
                justify-content: center;

                .dot {
                    display: block;
                }
            }
        `
    )}

    ${mq.from(
        'sm',
        css`
            grid-template-areas: 'love comment' 'numbers report';
            grid-template-columns: repeat(2, auto);

            .numbers {
                flex-direction: column;

                .dot {
                    display: none;
                }
            }
        `
    )}

    ${mq.from(
        'md',
        css`
            grid-template-areas: 'love comment report' 'numbers numbers numbers';
            grid-template-columns: repeat(3, auto);

            .numbers {
                flex-direction: row;
                justify-content: center;

                .dot {
                    display: block;
                }
            }
        `
    )}

    ${mq.from(
        'lg',
        css`
            grid-template-areas: 'love comment numbers report';
            grid-template-columns: repeat(4, auto);

            .numbers {
                flex-direction: column;

                .dot {
                    display: none;
                }
            }
        `
    )}
`;

const StoryInfo = (props: any) => {
    const { comments, handleClose, story, onloveStory, items, onComment } =
        props;
    const { clear } = useFilters();
    const router = useRouter();

    const onContribute = (communityId: number) => {
        clear('id');
        handleClose();
        router.push(`/communities/${communityId}?contribute`);
    };

    return (
        <>
            <Box mt={1}>
                {story?.message && (
                    <>
                        <Box show={{ sm: 'flex', xs: 'none' }}>
                            <Box>
                                <Trim
                                    g800
                                    large
                                    limit={256}
                                    message={story?.message}
                                    pb={0}
                                    pt={0}
                                    rows={4}
                                />
                            </Box>
                        </Box>
                        <Box show={{ sm: 'none', xs: 'flex' }}>
                            <Box>
                                <Trim
                                    g800
                                    large
                                    limit={100}
                                    message={story?.message}
                                    pb={0}
                                    pt={0}
                                    rows={4}
                                />
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
            <Box pb={0} pt={1}>
                <Button
                    fluid="xs"
                    icon="coinStack"
                    onClick={() => onContribute(story?.community?.id)}
                    reverse
                >
                    <Text as="div" medium>
                        <String id="donate" />
                    </Text>
                </Button>
            </Box>
            <Box mt={1}>
                <GridStyled>
                    <Box style={{ gridArea: 'love' }}>
                        <Button
                            gray
                            icon={
                                story?.engagement?.userLoved
                                    ? 'heartFilled'
                                    : 'heart'
                            }
                            onClick={() => onloveStory(story?.id)}
                            sColor={story?.engagement?.userLoved ? 'e600' : ''}
                            w="100%"
                        >
                            <Text as="div" g700 medium>
                                <String
                                    id={
                                        story?.engagement?.userLoved
                                            ? 'loved'
                                            : 'love'
                                    }
                                />
                            </Text>
                        </Button>
                    </Box>
                    <Box style={{ gridArea: 'comment' }}>
                        <Button
                            gray
                            icon="coment"
                            onClick={() => onComment()}
                            w="100%"
                        >
                            <Text as="div" g700 medium>
                                <String id="comment" />
                            </Text>
                        </Button>
                    </Box>
                    <Box
                        className="numbers"
                        g600
                        style={{ gridArea: 'numbers' }}
                    >
                        <Text regular small>
                            {story?.engagement?.loves} <String id="loves" />
                        </Text>
                        <span className="dot" />
                        <Text regular small>
                            {comments?.count} <String id="comments" />
                        </Text>
                    </Box>
                    <CanBeRendered types={['beneficiary', 'manager']}>
                        <Box
                            ml="auto"
                            style={{ gridArea: 'report' }}
                            tAlign="right"
                        >
                            <Box>
                                <DropdownMenu
                                    asButton
                                    icon="ellipsis"
                                    items={items}
                                    rtl
                                    wrapperProps={{ padding: 0.3 }}
                                />
                            </Box>
                        </Box>
                    </CanBeRendered>
                </GridStyled>
            </Box>
        </>
    );
};

export default StoryInfo;
