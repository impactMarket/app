import { useRouter } from 'next/router';
import React from 'react';

import {
    Box,
    Button,
    CountryFlag,
    Display,
    DropdownMenu,
    Grid,
    Icon,
    Label,
    Text
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';


const Header = ({ community, updateReview } : any) => {
    const router = useRouter()

    return (
        <>
            <Box as="a" onClick={() => router.back()}>    
                <Label
                    content="Back"
                    icon="arrowLeft"
                />                      
            </Box>
            {!!Object.keys(community).length && (
                <Grid cols={2} mt={1}>
                    <Box left>
                        <Display>{community?.name}</Display>
                        <Box fLayout="center start" inlineFlex mt={0.25} >
                            {!!community?.country &&
                                <CountryFlag
                                    countryCode={community?.country}
                                    mr={0.5}
                                />
                            }
                            
                            <Text extrasmall g500 medium>
                                {community?.city}
                            </Text>
                        </Box>
                    </Box>

                    <Box right>
                        {(community?.review === 'pending' || community?.review === 'declined') && (
                            <Box>
                                {community?.review !== 'declined' &&
                                    <Button
                                        mr={1}
                                        onClick={() => updateReview('declined')}
                                        secondary
                                    >
                                        <String id="decline"/>
                                    </Button>
                                }
                                <Button
                                    onClick={() => updateReview('claimed')}
                                >
                                    <String id="claim"/>
                                </Button>
                            </Box>
                        )}

                        {(community?.review === 'claimed' || community?.review === 'accepted') && (
                            <Box inlineFlex> 
                                <Button>
                                    <Icon
                                        icon="edit"
                                        margin="0 0.5 0 0"
                                        n01
                                    />
                                    Edit
                                </Button>

                                {community?.review === 'accepted' ? (
                                    <>
                                        <Button ml={0.5} secondary>
                                            <Icon
                                                icon="share"
                                                margin="0 0.5 0 0"
                                                p700
                                            />
                                            Share
                                        </Button>
                                        <Button ml={0.5} secondary>
                                            <Icon
                                                icon="heart"
                                                p700
                                            />
                                        </Button>
                                    </>
                                ) : (
                                    <Box ml={1}>
                                        <DropdownMenu
                                            asButton
                                            items={[
                                                {
                                                    icon: 'eye',
                                                    onClick: () => updateReview('accepted'),
                                                    title: 'Accept community'
                                                }
                                            ]}
                                            rtl
                                            title={<String id="actions"/>}
                                        />  
                                    </Box>  
                                )}                                  
                            </Box>
                        )}
                    </Box>
                </Grid>
            )} 
        </>
    );
};

export default Header;