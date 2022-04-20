import React from "react"

import {
  Box,
  Button,
  Card,
  Display,
  Grid,
  Text,
  ViewContainer
} from "@impact-market/ui"

// import { useGetCommunityMutation } from "../../api/community"

//  import { useSetCommunityReviewStateMutation } from '../../api/community';

const Requests: React.FC<{ isLoading?: boolean }> = (props) => {
    const { isLoading } = props;
    const community= props.community.data

    console.log(community)

    return (
        <ViewContainer isLoading={isLoading}>
            <Grid cols={2}>
                <Box>
                    <Display>{community.name}</Display>
                    <Text g500 mt={0.25} extrasmall medium>
                        {community.country}
                        {community.city}
                    </Text>
                </Box>
                <Box right>
                    <Button secondary mr={1}>
                        Decline
                    </Button>
                    <Button>Accept/Claim</Button>
                </Box>
            </Grid>
            <Grid cols={4}>
                <Card>
                    <Text regular small g500>
                        # Beneficiaries
                    </Text>
                    <Text semibold medium g900>
                        {Object.keys(community).length > 0 &&
                            community.state.beneficiaries}
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Claimed per beneficiary
                    </Text>
                    <Text semibold medium g900>
                        {Object.keys(community).length > 0 &&
                            community.state.claims}
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Maximum per beneficiary
                    </Text>
                    <Text semibold medium g900>
                        500
                    </Text>
                </Card>
                <Card>
                    <Text regular small g500>
                        Time increment
                    </Text>
                    <Text semibold medium g900>
                        5 minutes
                    </Text>
                </Card>
            </Grid>
        </ViewContainer>
    );
};

export default Requests;
