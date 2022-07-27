import { useSelector } from 'react-redux';
import React from 'react';

import {
    Box,
    CountryFlag,
    Display,
    Grid,
    Label,
    Text
} from '@impact-market/ui';

import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import Review from './ReviewState'
import String from '../../libs/Prismic/components/String';

const Header = ({ buttonLoading, community, updateReview }: any) => {
    const { user } = useSelector(selectCurrentUser);
    const router = useRouter();

    return (
        <>
            <Box as="a" onClick={() => router.back()}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>

            {!!Object.keys(community).length && (
                <Grid cols={{ sm: 2, xs: 1 }} mt={1}>
                    <Box>
                        <Display>{community?.name}</Display>
                        <Box fLayout="center start" inlineFlex mt={0.25}>
                            {!!community?.country && (
                                <CountryFlag
                                    countryCode={community?.country}
                                    mr={0.5}
                                />
                            )}

                            <Text g700 medium>
                                {community?.city}
                            </Text>
                        </Box>
                    </Box>
                    {(!!user?.ambassador || !!user?.manager) &&
                        <Review
                            buttonLoading={buttonLoading}
                            community={community}
                            updateReview={updateReview}
                        />
                    }

                </Grid>
            )}
        </>
    );
};

export default Header;
