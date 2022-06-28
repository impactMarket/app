import {
    Box,
    Col,
    Grid,
    Row,
    colors
} from '@impact-market/ui';
// import { dateHelpers } from '../../helpers/dateHelpers';
import styled from 'styled-components';

import Beneficiaries from './Beneficiaries';
import DonateCard from '../../components/DonateCard';
import Image from '../../components/Image';
import Map from '../../components/Map';
// import Organization from '../../components/Organization';
// import SocialLink from '../../components/SocialLink';
import Trim from '../../components/Trim';

const CommunityWrapper = styled(Grid)`
    > .grid-col:nth-child(2) {
        padding: 0;
    }
`;

const Divider = styled.hr`
    border: 1px solid ${colors.g200};
`;

const CommunityDetails = ({ community, data }: any) => {
    const { claimLocations, gps, contractAddress } = community;
    const { maxClaim } = data;

    const contributed = community?.state?.contributed || 0;
    const contributors = community?.state?.contributors || 0;
    const beneficiaries = community?.state?.beneficiaries || '0';

    const claims = claimLocations?.length
        ? claimLocations?.map((claim: any) => ({ ...claim }))
        : [gps];

    return (
        <>
            <CommunityWrapper
                cols={{ sm: 1, xs: 1 }}
                columnReverse
                margin={0}
                reverse="phone"
            >
                <Row mt={0.5} rowReverse>
                    <Box
                        borderRadius={{ sm: '0 8px 0 0', xs: '0' }}
                        fGrow="1"
                        flex
                        h={{ xs: 22 }}
                        overflow="hidden"
                        style={{ position: 'relative' }}
                    >
                        <Image
                            alt="Community cover image"
                            src={community?.coverMediaPath}
                        />
                    </Box>
                    <Col
                        colSize={{ sm: 8, xs: 12 }}
                        h={{ sm: 22, xs: 11 }}
                        padding={0}
                    >
                        <Box
                            borderRadius={{ sm: '16px 0 0 16px', xs: '0' }}
                            h="100%"
                            overflow="hidden"
                        >
                            <Map claims={claims} />
                        </Box>
                    </Col>
                </Row>
                <Beneficiaries data={data} />
            </CommunityWrapper>

            <Row mt={1}>
                <Col colSize={{ sm: 8, xs: 12 }} pr="2rem">
                    <Trim
                        g800
                        large
                        limit={100}
                        message={community?.description}
                        pb={0}
                        pt={0}
                        rows={4}
                    />

                    {/* TODO: 
                     - Get organization and social data and pass it to the Organization and SocialLink components 
                     - handle social icons
                    */}

                    {/* <Box fWrap="wrap" flex margin="1.5rem 0">
                        <SocialLink
                            href="www.oliviarhye.com"
                            icon="edit"
                            label="oliviarhye.com"
                        />
                        <SocialLink
                            href="www.google.com"
                            icon="edit"
                            label="oliviarhye"
                        />
                    </Box> */}

                    <Divider />

                    {/* <Organization
                        created={dateHelpers.compact('01/12/2020')}
                        description="RIO is an NGO focused on integrating migrants/ refugees into host economies. Using entrepreneurship education workshops and professional mentoring, the NGO aims to increase the quantity and the quality of the entrepreneur coming from the community of migrants/refugees and this impacts not only the individual but the entire local economy. Nowadays working in two refugee camps (Krisan and Ampain) in Ghana and in Rio de Janeiro, Brazil."
                        image={community?.coverMediaPath}
                        name="Refugee Integration Organisation (RIO)"
                    />

                    <Box fWrap="wrap" flex margin="1.5rem 0">
                        <SocialLink
                            href="www.oliviarhye.com"
                            icon="edit"
                            label="thisistheorganizationdomain.com"
                        />
                        <SocialLink
                            href="www.google.com"
                            icon="edit"
                            label="rio_org"
                        />
                    </Box> */}
                </Col>
                <Col colSize={{ sm: 4, xs: 12 }} pl={0}>
                    <DonateCard
                        backers={contributors}
                        beneficiariesNumber={beneficiaries}
                        contractAddress={contractAddress}
                        goal={maxClaim * beneficiaries}
                        raised={contributed}
                    />
                </Col>
            </Row>
        </>
    );
};

export default CommunityDetails;
