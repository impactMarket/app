/* eslint-disable react-hooks/rules-of-hooks */
import {
    Avatar,
    Box,
    Button,
    Card,
    Col,
    CountryFlag,
    Divider,
    DropdownMenu,
    Row,
    Text,
    openModal
} from '@impact-market/ui';
import {
    Story,
    useGetStoriesMutation,
    useLoveStoryMutation
} from '../../api/story';
import {
    checkUserPermission,
    userBeneficiary,
    userManager
} from '../../utils/users';
import { getCountryNameFromInitials } from '../../utils/countries';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import NoStoriesFound from './NoStoriesFound';
import React, { useEffect, useState } from 'react';
import String from '../../libs/Prismic/components/String';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useWallet from '../../hooks/useWallet';

const limit = 3;

interface storyListProps {
    refreshStory: boolean;
}

const StoryList: React.FC<storyListProps> = ({ refreshStory }) => {
    const [stories, setStories] = useState<{ count: number; list: Story[] }>({
        count: 0,
        list: []
    });
    const [offset, setOffset] = useState<number>();
    const [loadingStories, setLoadingStories] = useState(true);
    const [getStories] = useGetStoriesMutation();
    const [loveStory] = useLoveStoryMutation();
    const [changed, setChanged] = useState<Date>(new Date());
    const { connect } = useWallet();
    const router = useRouter();
    const { asPath, query } = router;
    const { country, communityId, user } = query;
    const auth = useSelector(selectCurrentUser);

    const loadItems = () => {
        if (offset < stories.count) {
            setOffset(offset + limit);
        }
    };

    const [sentryRef] = useInfiniteScroll({
        hasNextPage: offset < stories.count,
        loading: loadingStories,
        onLoadMore: loadItems
    });

    useEffect(() => {
            const getStoriesMethod = async () => {
                try {
                    setLoadingStories(true);
                    const filters = asPath.split('?')?.[1];
                    const { data, success, count } = await getStories({
                        filters,
                        limit,
                        offset
                    }).unwrap();

                    if (success) {
                        setStories({
                            count,
                            list: stories.list.concat(data)
                        });
                    }

                    setLoadingStories(false);
                } catch (error) {
                    console.log(error);
                    
                    setLoadingStories(false);

                    return false;
                }
            };

            getStoriesMethod();
        
    }, [offset, changed]);

    useEffect(() => {
        try {
            const changeFilter = () => {
                setStories({ count: 0, list: [] });

                if (offset === 0) {
                    setChanged(new Date());
                } else {
                    setOffset(0);
                }
            };

            changeFilter();
        } catch (error) {
            console.log(error);
        }
    }, [country, communityId, refreshStory, user]);

    const onLoveStoryFunction = (id: number, index: number) => {
        try {
            const elementToEdit = stories.list.find(
                (_x, indexStory) => indexStory === index
            );

            if (elementToEdit) {
                loveStory(id);

                setStories((currentStory) => ({
                    count: currentStory.count,
                    list: currentStory.list.map((x, storyIndex) => {
                        if (storyIndex === index) {
                            return {
                                ...x,
                                engagement: {
                                    loves: !x.engagement.userLoved
                                        ? x.engagement.loves + 1
                                        : x.engagement.loves - 1,
                                    userLoved: !x.engagement.userLoved
                                }
                            };
                        }

                        return x;
                    })
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getMedia = (filePath: string) =>
        getImage({
            filePath,
            fit: 'cover',
            height: 0,
            width: 0
        });

    const onloveStory = async (id: number, index: number) => {
        try {
            if (!auth?.user) {
                await connect(() => onLoveStoryFunction(id, index));
            } else {
                onLoveStoryFunction(id, index);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onContribuite = async () => {
        try {
            if (!auth?.user) {
                await connect();
            } else {
                // TODO contribuite functionality
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderStory = (story: any, index: number) => {
        const items = [];

        if (story.isDeletable) {
            items.unshift({
                icon: 'trash',
                onClick: () =>
                    openModal('deleteStory', {
                        arrayId: index,
                        removeIndex: (index: number) =>
                            setStories(
                                (oldStories: {
                                    count: number;
                                    list: Story[];
                                }) => ({
                                    count: oldStories.count--,
                                    list: oldStories.list.filter(
                                        (_x, storiesIndex) =>
                                            index !== storiesIndex
                                    )
                                })
                            ),
                        storyId: story.id
                    }),
                title: <String id="deletePost" />
            });
        } else {
            items.unshift({
                icon: 'sad',
                onClick: () =>
                    openModal('reportStory', {
                        arrayId: index,
                        removeIndex: (index: number) =>
                            setStories(
                                (oldStories: {
                                    count: number;
                                    list: Story[];
                                }) => ({
                                    count: oldStories.count--,
                                    list: oldStories.list.filter(
                                        (_x, storiesIndex) =>
                                            index !== storiesIndex
                                    )
                                })
                            ),
                        storyId: story.id
                    }),
                title: <String id="reportAsInappropriate" />
            });
        }

        return (
            <Row fLayout="center" key={index}>
                <Col colSize={{ sm: 10, xs: 11 }}>
                    <Card mt={1}>
                        {story?.storyMediaPath && (
                            <Box
                                bgImg={() => getMedia(story?.storyMediaPath)}
                                h={22.188}
                                pt="56.25%"
                                radius={0.5}
                                w="100%"
                            />
                        )}
                        <Row fLayout="between" mt={0.625}>
                            <Col colSize={{ sm: 6, xs: 12 }} ml={0.625}>
                                <Row>
                                    <Box flex>
                                        <Box>
                                            <Avatar
                                                h={3}
                                                url={() =>
                                                    getMedia(
                                                        story?.community
                                                            ?.coverMediaPath
                                                    )
                                                }
                                                w={3}
                                            />
                                        </Box>
                                        <Box ml={1} mr={1}>
                                            <Text g700 semibold>
                                                {story.community.name}
                                            </Text>
                                            <Text g500 regular small>
                                                <Box fLayout="center" flex>
                                                    <Box mr={0.5}>
                                                        <CountryFlag
                                                            countryCode={
                                                                story.community
                                                                    .country
                                                            }
                                                            size={[2, 2]}
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Text>
                                                            {
                                                                story.community
                                                                    .city
                                                            }
                                                            ,{' '}
                                                            {getCountryNameFromInitials(
                                                                story.community
                                                                    .country
                                                            )}
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            </Text>
                                        </Box>
                                    </Box>
                                </Row>
                            </Col>
                            {story?.message && (
                                <Text
                                    g800
                                    large
                                    medium
                                    pb={0}
                                    pt={0}
                                    show={{ sm: 'none', xs: 'flex' }}
                                >
                                    {story.message}
                                </Text>
                            )}
                            <Col colSize={{ sm: 3, xs: 12 }} right>
                                <Button
                                    fluid="xs"
                                    icon="coinStack"
                                    onClick={() => onContribuite()}
                                    reverse
                                >
                                    <String id="contribute" />
                                </Button>
                            </Col>
                        </Row>
                        <Divider mt={1.625} show={{ sm: 'flex', xs: 'none' }} />
                        {story?.message && (
                            <Box show={{ sm: 'flex', xs: 'none' }}>
                                <Text g800 large medium>
                                    {story.message}
                                </Text>
                            </Box>
                        )}
                        <Row fLayout="center" mt={0}>
                            <Col colSize={{ sm: 3, xs: 12 }}>
                                <Button
                                    fluid="xs"
                                    gray
                                    icon={
                                        story.engagement.userLoved
                                            ? 'heartFilled'
                                            : 'heart'
                                    }
                                    onClick={() => onloveStory(story.id, index)}
                                    sColor={
                                        story.engagement.userLoved ? 'e600' : ''
                                    }
                                >
                                    <Text g700 medium>
                                        <String
                                            id={
                                                story.engagement.userLoved
                                                    ? 'loved'
                                                    : 'love'
                                            }
                                        />
                                    </Text>
                                </Button>
                            </Col>
                            <Col
                                center
                                colSize={{ sm: 5, xs: 6 }}
                                show={{ sm: 'flex', xs: 'none' }}
                            >
                                <Text g600 regular small>
                                    {story.engagement.loves}{' '}
                                    <String id="loves" />
                                </Text>
                            </Col>
                            <Col
                                colSize={{ sm: 5, xs: 6 }}
                                pt={0}
                                show={{ sm: 'none', xs: 'center' }}
                            >
                                <Text g600 regular small>
                                    {story.engagement.loves}{' '}
                                    <String id="loves" />
                                </Text>
                            </Col>
                            <Col colSize={{ sm: 4, xs: 6 }} pt={0} right>
                                {checkUserPermission([
                                    userManager,
                                    userBeneficiary
                                ]) && (
                                    <DropdownMenu
                                        asButton
                                        icon="ellipsis"
                                        items={items}
                                        rtl
                                    />
                                )}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        );
    };

    return (
        <div>
            {!loadingStories && stories.list.length === 0 && <NoStoriesFound />}
            {stories.list.map((story: any, index: number) =>
                renderStory(story, index)
            )}
            {(loadingStories || offset < stories.count) && (
                <div ref={sentryRef} />
            )}
        </div>
    );
};

export default StoryList;
