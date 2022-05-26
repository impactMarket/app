import {
    Box,
    Button,
    Card,
    Col,
    CountryFlag,
    Divider,
    DropdownMenu,
    Row,
    Spinner,
    Text,
    openModal
} from '@impact-market/ui';
import {
    Story,
    useGetStoriesMutation,
    useLoveStoryMutation
} from '../../api/story';
import { getCountryNameFromInitials } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CanBeRendered from '../../components/CanBeRendered';
import Image from '../../components/Image';
import NoStoriesFound from './NoStoriesFound';
import React, { useEffect, useState } from 'react';
import String from '../../libs/Prismic/components/String';
import Trim from '../../components/Trim';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const limit = 10;

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
    const { t } = useTranslations();

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

    // Contribute button
    // const onContribuite = async () => {
    //     try {
    //         if (!auth?.user) {
    //             await connect();
    //         } else {
    //             // TODO contribuite functionality
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

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
                title: t('deletePost')
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
                title: t('reportAsInappropriate')
            });
        }

        return (
            <Row fLayout="center" key={index}>
                <Col colSize={{ sm: 10, xs: 11 }} padding={0} pb={1} >
                    <Card mt={1} padding={0}>
                        {story?.storyMediaPath && (  
                        <Box pt="60%" style={{position: 'relative'}} w="100%">
                            <Image alt="" src={story?.storyMediaPath} style={{borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}} />
                        </Box>
                          
                        )}
                        <Row fLayout="between" mt={0.625} pl={1} pr={1}>
                            <Col colSize={{ sm: 6, xs: 12 }} ml={0.625}>
                                <Row>
                                    <Box flex>
                                        <Box>
                                        <Box h={3} pt="100%" style={{position: 'relative'}}  w={3}>
                                            <Image alt="" src={story?.community?.coverMediaPath} style={{borderRadius: "50%"}} />
                                        </Box>
                                        </Box>
                                        <Box ml={1} mr={1}>
                                            <Text g700 semibold>
                                                {story.community.name}
                                            </Text>
                                            <Text as="div" g500 regular small>
                                                <Box fLayout="center start" flex >
                                                    <CountryFlag countryCode={story.community.country} height={1.2} mr={0.5} />
                                                    <Box>
                                                        <Text>
                                                            {story.community.city},{' '}
                                                            {getCountryNameFromInitials(story.community.country)}
                                                        </Text>
                                                    </Box>
                                                </Box>
                                            </Text>
                                        </Box>
                                    </Box>
                                </Row>
                            </Col>
                            {story?.message && (
                                <Box show={{ sm: 'none', xs: 'flex' }}>
                                    <Box>
                                        <Trim g800 large limit={100} message={story.message} pb={0} pt={0} rows={4} />
                                    </Box>
                                </Box>

                            )}
                            <Col colSize={{ sm: 3, xs: 12 }} right>
                                {/* Countribute Button */}
                                {/* <Button
                                    fluid="xs"
                                    icon="coinStack"
                                    onClick={() => onContribuite()}
                                    reverse
                                >
                                    <String id="contribute" />
                                </Button> */}
                            </Col>
                        </Row>
                        <Box pl={1} pr={1}>
                            <Divider mt={1.625} show={{ sm: 'flex', xs: 'none' }}/>
                        </Box>
                        {story?.message && (
                        <Box show={{ sm: 'flex', xs: 'none' }}>
                            <Box pl={1} pr={1}>
                                <Trim g800 large limit={256} message={story.message} pb={0} pt={0} rows={4} />
                            </Box>
                        </Box>
                        )}

                        <Box fLayout="start between" flex mt={{sm: 2, xs: 0}} pb={1} pl={1} pr={1}>
                            <Row fLayout="center start" margin={0} w="100%">
                                <Col colSize={{ sm: 3, xs: 12}} padding={0}>
                                    <Button
                                        fluid="xs"
                                        gray
                                        icon={story.engagement.userLoved ? 'heartFilled' : 'heart'}
                                        onClick={() => onloveStory(story.id, index)}
                                        sColor={story.engagement.userLoved ? 'e600' : ''}
                                    >
                                        <Text as="div" g700 medium>
                                            <String id={ story.engagement.userLoved ? 'loved' : 'love'} />
                                        </Text>
                                    </Button>
                                </Col>

                                {story.engagement.loves > 0 && (
                                    <Col colSize={{ sm: 6, xs: 12 }} padding={0} pl={{ sm: 1, xs: 0}} pt={{ sm: 0, xs: 1}}>
                                        <Text g600 regular small>
                                            {story.engagement.loves}{' '}
                                            <String id="loves" /> 
                                        </Text>
                                    </Col>
                                )}
                              
                            </Row>

                            <CanBeRendered types={['beneficiary', 'manager']}>
                                <Box pl={{sm: 0, xs: 1}}>
                                    <DropdownMenu asButton icon="ellipsis" items={items} rtl wrapperProps={{ padding: 0.3 }} />
                                </Box>
                            </CanBeRendered>
                        </Box>
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
                <div ref={sentryRef}> 
                <Row fLayout="center" h="50vh" pb={1} pt={1}>
                    <Spinner isActive />
                </Row>
                </div>
            )}
        </div>
    );
};

export default StoryList;
