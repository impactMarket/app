import React from 'react';

import {
    Box,
    Card,
    Grid,
    PulseIcon,
    Text
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';


const Beneficiaries = ({ data } : any) => (    
    !!Object.keys(data).length && (
        <Grid cols={{ sm: 4, xs: 2 }}>
            {!!data?.beneficiaries &&
                <Card>
                    <Text g500 mb={0.3} regular small>
                        # <String id="beneficiaries"/>
                    </Text>
                    <Grid cols={2}>
                        <Text g900 medium semibold>
                            {data?.beneficiaries}
                        </Text>
                        <Box right>
                            <PulseIcon
                                bgS100
                                borderColor="s50"
                                icon="users"
                                s600
                                size={2}
                            />
                        </Box>
                    </Grid>
                </Card>
            }
            {!!data?.claimAmount &&
                <Card>
                    <Text g500 mb={0.3} regular small>
                        <String id="claimPerBeneficiary"/>
                    </Text>
                    <Grid cols={2}>
                        <Text g900 medium semibold>
                        {data?.claimAmount}
                        </Text>
                        <Box right>
                            <PulseIcon
                                bgS100
                                borderColor="s50"
                                icon="heart"
                                s600
                                size={2}
                            />
                        </Box>
                    </Grid>   
                </Card>
            }
            {!!data?.maxClaim &&
                <Card>
                    <Text g500 mb={0.3} regular small>
                        <String id="maxPerBeneficiary"/>
                    </Text>
                    <Grid cols={2}>
                        <Text g900 medium semibold>
                            {data?.maxClaim}
                        </Text>
                        <Box right>
                            <PulseIcon
                                bgS100
                                borderColor="s50"
                                icon="check"
                                s600
                                size={2}
                            />
                        </Box>
                    </Grid>
                </Card>
            }
            {!!data?.incrementInterval &&
                <Card>
                    <Text g500 mb={0.3} regular small>
                        <String id="timeIncrement"/>
                    </Text>
                    <Grid cols={2}>
                        <Text g900 medium semibold>
                            {data?.incrementInterval} <String id="minutes"/>
                        </Text>
                        <Box right>
                            <PulseIcon
                                bgS100
                                borderColor="s50"
                                icon="clock"
                                s600
                                size={2}
                            />
                        </Box>
                    </Grid>              
                </Card>
            }
            {(!!data?.minTranche && !!data?.maxTranche) &&            
                <Card>
                    <Text g500 mb={0.3} regular small>
                        <String id="trancheMinMax"/>
                    </Text>
                    <Grid cols={2}>
                        <Text g900 medium semibold>
                            {data?.minTranche}/{data?.maxTranche}
                        </Text>
                        <Box right>
                            <PulseIcon
                                bgS100
                                borderColor="s50"
                                icon="coins"
                                s600
                                size={2}
                            />
                        </Box>
                    </Grid>                       
                </Card>
            }
        </Grid> 
    )
)

export default Beneficiaries;
