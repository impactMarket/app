import { Box, Col, Grid, Row } from '@impact-market/ui';
import styled from 'styled-components';

import Beneficiaries from './Beneficiaries';
import DonateCard from '../../components/DonateCard';
import Image from '../../components/Image';
import Map from '../../components/Map';
import Trim from '../../components/Trim';

const CommunityWrapper = styled(Grid)`
    > .grid-col:nth-child(2) {
        padding: 0;
    }
`;

const CommunityDetails = ({ community, data }: any) => {
    const { claimLocations, gps, contractAddress } = community;
    const { maxClaim } = data;

    const contributed = community?.state?.contributed || 0;
    const contributors = community?.state?.contributors || 0;
    const beneficiaries = community?.state?.beneficiaries || 0;

    const claims = claimLocations?.length ? claimLocations?.map((claim: any) => ({ gps: claim })) : [{ gps }];

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
                        borderRadius={{sm: '0 8px 0 0', xs: '0'}}
                        fGrow="1"
                        flex
                        h={{ xs: 22 }}
                        overflow="hidden"
                        style={{ position: 'relative' }}
                    >
                        <Image alt="" src={community?.coverMediaPath}/>
                    </Box>
                    <Col
                        colSize={{ sm: 8, xs: 12 }}
                        h={{ sm: 22, xs: 11 }}
                        padding={0}
                    >
                        <Box borderRadius={{sm: '16px 0 0 16px', xs: '0'}} h="100%" overflow="hidden">
                            <Map claims={claims} />
                        </Box>
                    </Col>
                </Row>
                <Beneficiaries data={data} />
            </CommunityWrapper>

            <Row mt={1}>
                <Col colSize={{ sm: 8, xs: 12 }}>
                    <Trim
                        g800
                        large
                        limit={100}
                        message={community?.description}
                        pb={0}
                        pt={0}
                        rows={4}
                    />
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
