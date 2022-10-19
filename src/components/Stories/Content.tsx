import { Box, Col, Spinner } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useSelector } from 'react-redux';
import Comments from './Comments'
import CommunityInfo from './CommunityInfo'
import React, { useState } from 'react';
import StoryInfo from './StoryInfo'
import config from '../../../config';
import useFilters from '../../hooks/useFilters';
import useStoryComments from "../../hooks/useStoryComments";
import useWallet from '../../hooks/useWallet';

const fetcher = (url: string, headers: any | {}) => fetch(config.baseApiUrl + url, headers).then((res) => res.json());

const StoryContent = (props: any) => {
    const { handleClose, story, community, onloveStory, items } = props;
    const { clear } = useFilters();
    const { connect } = useWallet();
    const auth = useSelector(selectCurrentUser);
    const { comments, loadingComments } = useStoryComments(story?.id, fetcher);
    const [openNewComment, setOpenNewComment] = useState(false)

    const onComment = async () => {
        try {
            if (!auth?.user) {
                clear('id');
                handleClose();
                await connect();
            } else {
                setOpenNewComment(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Col colSize={{sm: 5, xs: 12}} fDirection="column" flex h="100%" pb={0} pl={{sm: 2.25, xs: 1}} pt={{sm: 1.5, xs: 1}}>
            <CommunityInfo 
                community={community}
                handleClose={handleClose}
                story={story}
            />
            <StoryInfo 
                comments={comments}
                handleClose={handleClose}
                items={items}
                onComment={onComment}
                onloveStory={onloveStory}
                setOpenNewComment={setOpenNewComment}
                story={story}
            />
            {loadingComments ? (
                <Box fLayout="center" flex mt={1}>
                    <Spinner isActive />
                </Box>
            ) : (
                <Comments 
                    comments={comments}
                    openNewComment={openNewComment}
                    setOpenNewComment={setOpenNewComment}
                    story={story}
                />
            )}
        </Col>
    );
};

export default StoryContent;
