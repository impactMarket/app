import { Col, Grid, Row } from '@impact-market/ui';
import { mq } from 'styled-gen';
import Beneficiaries from './Beneficiaries';
import DonateCard from '../../components/DonateCard';
import Image from '../../components/Image';
import Map from '../../components/Map';
import Trim from '../../components/Trim';
import styled, { css } from 'styled-components';

const MapWrapper = styled.div`
    border-radius: 16px 0px 0px 16px;
    height: 100%;
    overflow: hidden;
    width: 100%;

    ${mq.phone(css`
        border-radius: 4.2449px;
    `)};
`;

const BoderedImage = styled(Image)`
    border-radius: 0 8px 0 0;

    ${mq.phone(css`
        border-radius: 0;
    `)};
`;

const CommunityWrapper = styled(Grid)`
    > .grid-col:nth-child(2) {
        padding: 0;
    }
`;

const CommunityDetails = ({ community, data }: any) => {
    const contributed = community?.state?.contributed || 0;
    const contributors = community?.state?.contributors || 0;
    const beneficiaries = community?.state?.beneficiaries || 0;
    const maxClaim = data?.maxClaim || 0;
    const contractAddress = community?.contractAddress || '0';

    return (
        <>
            <CommunityWrapper
                cols={{ sm: 1, xs: 1 }}
                columnReverse
                margin={0}
                reverse="phone"
            >
                <Row mt={0.5} rowReverse>
                    <Col
                        colSize={{ sm: 4, xs: 12 }}
                        h={{ xs: 22 }}
                        style={{ position: 'relative' }}
                    >
                        <BoderedImage alt="" src={community?.coverMediaPath} />
                    </Col>
                    <Col
                        colSize={{ sm: 8, xs: 12 }}
                        h={{ sm: 22, xs: 11 }}
                        padding={0}
                    >
                        <MapWrapper>
                            <Map claims={community?.gps} />
                        </MapWrapper>
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
