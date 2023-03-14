import { useSelector } from 'react-redux';
import React from 'react';

import {
    Box,
    CountryFlag,
    Display,
    Label,
    Text
} from '@impact-market/ui';

import { getCountryNameFromInitials } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useRouter } from 'next/router';
import Actions from './Actions'
import String from '../../libs/Prismic/components/String';

const Header = ({ buttonLoading, community, updateReview, thegraphData }: any) => {
    const { user } = useSelector(selectCurrentUser);
    const router = useRouter();

    return (
        <>
            {community?.requestByAddress !== user?.address &&
                <Box as="a" onClick={() => router.back()}>
                    <Label content={<String id="back" />} icon="arrowLeft" />
                </Box>
            } 

            {!!Object.keys(community).length && (
                <Box flex fLayout="start between" fWrap="wrap" style={{ gap: "1rem" }} mt={1} pt={1} pb={1}>
                    <Box>
                        <Display>{community?.name}</Display>
                        <Box fLayout="center start" inlineFlex mt={0.25}>
                            {!!community?.country && (
                                <CountryFlag
                                    countryCode={community?.country}
                                    mr={0.5}
                                />
                            )}

                            <Text g700 medium w="100%">
                                {community?.city}, {getCountryNameFromInitials(community?.country)}
                            </Text>
                        </Box>
                    </Box>
                    {(!!user?.ambassador || !!user?.councilMember) &&
                        <Actions
                            buttonLoading={buttonLoading}
                            community={community}
                            updateReview={updateReview}
                            thegraphData={thegraphData}
                        />
                    }
                </Box>
            )}
        </>
    );
};

export default Header;
