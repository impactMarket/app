import {
    Box,
    Button,
    Col,
    CountryFlag,
    DropdownMenu,
    ModalWrapper,
    Row,
    Spinner,
    Text,
    TextLink,
    openModal,
    toast,
    useModal
} from '@impact-market/ui';
import { Story, useLoveStoryMutation } from '../../api/story';
import { formatAddress } from '../../utils/formatAddress';
import { getCountryNameFromInitials } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useGetCommunityMutation } from '../../api/community';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import CanBeRendered from '../../components/CanBeRendered';
import Image from '../../components/Image';
import Link from 'next/link';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import Slider from '../../components/Slider/Slider'
import String from '../../libs/Prismic/components/String';
import Trim from '../../components/Trim';
import config from '../../../config';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const OpenStory: React.FC = () => {
    const { handleClose, SingleRequest, setStories, loveStoryById } = useModal();
    const [story, setStory] = useState(SingleRequest?.data);
    const [community, setCommunity] = useState<any>([]);
    // const { view } = usePrismicData();
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

                const communityRequest: any = await getCommunity(story?.community?.id).unwrap();

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
                    loves: !story?.engagement?.userLoved ? story?.engagement?.loves + 1 : story?.engagement?.loves - 1,
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
                await connect(() => onLoveStoryFunction(id));
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
            list: oldStories.list.filter((story) => story?.id.toString() !== filterId)})
        );
    };

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success(<Message id="copiedAddress" />);
    };

    const onContribute = (communityId: number) => {
        clear('id');
        handleClose();
        router.push(`/communities/${communityId}?contribute`);
    };

    const renderStory = () => {
        const items = [];

        if (story?.isDeletable) {
            items.unshift({
                icon: 'trash',
                onClick: () => openModal('deleteStory', {removeIndexById, setStories, story, storyId: story?.id}),
                title: t('deletePost')
            });
        } else {
            items.unshift({
                icon: 'sad',
                onClick: () => openModal('reportStory', {removeIndexById, setStories, story, storyId: story?.id}),
                title: t('reportAsInappropriate')});
        }

        const shareItems = [
            {
                icon: 'copy',
                onClick: () => copyToClipboard(config.publicUrl + asPath),
                title: 'Copy Link'
            }
        ];

        return (
            <>
                <Row h="100%" margin={0} maxH="100%" pb={0} pr={{sm: 0.5, xs: 0}} w="100%" >
                    <Col bTopLeftRadius={{sm: 0, xs: 0.5}} bTopRightRadius={{sm: 0, xs: 0.5}} bgColor="g100" colSize={{sm: 7, xs: 12}} fLayout="center" flex  h={{sm: "100%", xs: "50%"}}  padding={0} style={{overflow: "hidden", position:'relative'}}> 
                        <Slider slides={story?.storyMedia}/>
                    </Col>

                    <Col colSize={{sm: 5, xs: 12}} h={{sm: "100%", xs: "50%"}} overflow="hidden" overflowY="auto" pl={{sm: 2.25, xs: 1}} pt={{sm: 1.5, xs: 1}}>
                        <Box fLayout="center between" flex pb={1} pl={0}>
                            <Box>
                                <Box flex pl={1}>
                                    <Box onClick={() => handleClose()}>
                                        <Link href={`/communities/${story?.community?.id}`} passHref >
                                            <Box h={3} pt="100%" style={{ position: 'relative' }} w={3} >
                                                <Image alt="" src={story?.community?.coverMediaPath} style={{borderRadius: '50%'}} />
                                            </Box>
                                        </Link>
                                    </Box>
                                    <Box ml={1} mr={1}>
                                        <Box onClick={() => handleClose()}>
                                            <Link as="div" href={`/communities/${story?.community?.id}`} passHref>
                                                <TextLink as="div">
                                                    <Text g700 semibold>
                                                        {story?.community?.name}
                                                    </Text>
                                                </TextLink>
                                            </Link>
                                        </Box>
                                        <Text as="div" g500 regular small>
                                            <Box fLayout="center start" flex>
                                                <CountryFlag countryCode={story?.community?.country} height={1.2} mr={0.5} />
                                                <Box>
                                                    <Text>
                                                        {story?.community?.city},{' '}{getCountryNameFromInitials(story?.community?.country)}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                           
                        </Box>

                        <Row >
                            <Col colSize={6}>
                                <DropdownMenu
                                    icon="chevronDown"
                                    items={[
                                        {
                                            icon: 'open',
                                            onClick: () => window.open(config.explorerUrl?.replace('#USER#', community?.contractAddress)),
                                            title: t('openInExplorer')
                                        },
                                        {
                                            icon: 'copy',
                                            onClick: () => copyToClipboard(community?.contractAddress),
                                            title: t('copyAddress')
                                        }
                                    ]}
                                    title={formatAddress(community?.contractAddress, [6, 4])}
                                    wrapperProps={{ mt: 0.25 }}
                                />
                            </Col>
                            <Col colSize={6} right >
                                <DropdownMenu icon="share" items={shareItems} rtl title= {t('share')} titleColor="g900" />  
                            </Col>
                        </Row>

                        <Row>
                            {story?.message && (
                                <>
                                    <Box show={{ sm: 'flex', xs: 'none' }}>
                                        <Box>
                                            <Trim g800 large limit={256} message={story?.message} pb={0} pt={0} rows={4} />
                                        </Box>
                                    </Box>
                                    <Box show={{ sm: 'none', xs: 'flex' }}>
                                        <Box>
                                            <Trim g800 large limit={100} message={story?.message} pb={0} pt={0} rows={4} />
                                        </Box>
                                    </Box>
                                </>
                            )}
                        </Row>

                        <Box pb={0} pt={1}>
                            <Button
                                fluid="xs"
                                icon="coinStack"
                                onClick={() => onContribute(story?.community?.id)}
                                reverse
                            >
                                <String id="contribute" />
                            </Button>
                        </Box>

                        <Row>
                            <Box fLayout="start between" flex mt={1} padding={1} pt={0} w="100%" >
                                <Row fLayout="center start" margin={0} w="100%">
                                    <Col colSize={{sm: 7, xs: 12}} padding={0} >
                                        <Button
                                            fluid="xs"
                                            gray
                                            icon={story?.engagement?.userLoved ? 'heartFilled' : 'heart'}
                                            onClick={() => onloveStory(story?.id)}
                                            sColor={story?.engagement?.userLoved ? 'e600' : ''}>
                                            <Text as="div" g700 medium>
                                                <String id={story?.engagement?.userLoved ? 'loved' : 'love'} />
                                            </Text>
                                        </Button>
                                    </Col>
                                    {story?.engagement?.loves > 0 && (
                                        <Col colSize={{sm: 5, xs: 12}} padding={0} pl={{sm: 1, xs: 0}} pt={{sm: 0, xs: 1}}>
                                            <Text as="div" g600 regular small>
                                                {story?.engagement?.loves}{' '}<String id="loves" />
                                            </Text>
                                        </Col>
                                    )}
                                </Row>
                                <CanBeRendered types={['beneficiary', 'manager']} >
                                    <Box pl={{sm: 0, xs: 1}}>
                                        <DropdownMenu asButton icon="ellipsis" items={items} rtl wrapperProps={{padding: 0.3}} />
                                    </Box>
                                </CanBeRendered>
                            </Box>
                        </Row>
                    </Col>
                </Row>
            </>
        );
    };

    return (
        <ModalWrapper h="100%" maxH="100%" onCloseButton={() => {handleClose(); clear('id')}} padding={{sm: 1, xs: 0}} pb={0.5} w="100%">
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
