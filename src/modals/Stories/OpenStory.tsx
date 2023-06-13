import {
    Col,
    ModalWrapper,
    Row,
    Spinner,
    openModal,
    useModal
} from '@impact-market/ui';
import { Story, useLoveStoryMutation } from '../../api/story';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunityMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Content from '../../components/Stories/Content';
import React, { useEffect, useState } from 'react';
import Slider from '../../components/Slider/Slider';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const OpenStory: React.FC = () => {
    const { handleClose, SingleRequest, setStories, loveStoryById } =
        useModal();
    const [story, setStory] = useState(SingleRequest?.data);
    const [community, setCommunity] = useState<any>({});
    const {} = usePrismicData();
    const { t } = useTranslations();
    const { clear } = useFilters();
    const auth = useSelector(selectCurrentUser);
    const { connect } = useWallet();
    const [loveStory] = useLoveStoryMutation();
    const [getCommunity] = useGetCommunityMutation();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { asPath } = router;
    const filters = asPath.split('?')?.pop();
    const filterId = filters.split('=').pop();

    useEffect(() => {
        const getCommunityMethod = async () => {
            try {
                setLoading(true);

                const communityRequest: any = await getCommunity(
                    story?.community?.id
                ).unwrap();

                setCommunity(communityRequest);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        getCommunityMethod();
    }, []);

    const onLoveStoryFunction = (id: number) => {
        try {
            loveStory(id);
            setStory({
                ...story,
                engagement: {
                    loves: !story?.engagement?.userLoved
                        ? story?.engagement?.loves + 1
                        : story?.engagement?.loves - 1,
                    userLoved: !story?.engagement?.userLoved
                }
            });
            loveStoryById(id);
        } catch (error) {
            console.log(error);
        }
    };

    const onloveStory = async (id: number) => {
        try {
            if (!auth?.user) {
                clear('id');
                handleClose();
                await connect();
            } else {
                onLoveStoryFunction(id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeIndexById = () => {
        setStories((oldStories: { count: number; list: Story[] }) => ({
            count: oldStories.count--,
            list: oldStories.list.filter(
                (story) => story?.id.toString() !== filterId
            )
        }));
    };

    const renderStory = () => {
        const items = [];

        if (story?.isDeletable) {
            items.unshift({
                icon: 'trash',
                onClick: () =>
                    openModal('deleteStory', {
                        removeIndexById,
                        setStories,
                        story,
                        storyId: story?.id
                    }),
                title: t('deletePost')
            });
        } else {
            items.unshift({
                icon: 'sad',
                onClick: () =>
                    openModal('reportStory', {
                        removeIndexById,
                        setStories,
                        story,
                        storyId: story?.id
                    }),
                title: t('reportAsInappropriate')
            });
        }

        return (
            <>
                <Row
                    h="100%"
                    margin={0}
                    maxH="100%"
                    pb={0}
                    pr={{ sm: 0.5, xs: 0 }}
                    w="100%"
                >
                    <Col
                        bTopLeftRadius={{ sm: 0, xs: 0.5 }}
                        bTopRightRadius={{ sm: 0, xs: 0.5 }}
                        bgColor="g100"
                        colSize={{ sm: 7, xs: 12 }}
                        fLayout="center"
                        flex
                        h={{ sm: '100%', xs: '50%' }}
                        padding={0}
                        style={{ overflow: 'hidden', position: 'relative' }}
                    >
                        <Slider slides={story?.storyMedia} />
                    </Col>
                    <Content
                        community={community}
                        handleClose={handleClose}
                        items={items}
                        onloveStory={onloveStory}
                        story={story}
                    />
                </Row>
            </>
        );
    };

    return (
        <ModalWrapper
            h={{ phone: 'unset', tablet: '100%' }}
            maxH={{ phone: 'unset', tablet: '100%' }}
            onCloseButton={() => {
                handleClose();
                clear('id');
            }}
            padding={{ sm: 1, xs: 0 }}
            pb={0.5}
            w="100%"
        >
            {loading ? (
                <Row fLayout="center" h="50vh" mt={2}>
                    <Spinner isActive />
                </Row>
            ) : (
                renderStory()
            )}
        </ModalWrapper>
    );
};

export default OpenStory;
