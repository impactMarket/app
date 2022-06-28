import {
    Box,
    Col,
    Grid,
    Row,
    colors,
    toast
} from '@impact-market/ui';
import { dateHelpers } from '../../helpers/dateHelpers';
import styled from 'styled-components';

import Beneficiaries from './Beneficiaries';
import DonateCard from '../../components/DonateCard';
import Image from '../../components/Image';
import Map from '../../components/Map';
import Organization from '../../components/Organization';
import SocialLink from '../../components/SocialLink';
import Trim from '../../components/Trim';

import { selectCurrentUser } from '../../state/slices/auth';
import { useSelector } from 'react-redux';
import useWallet from '../../hooks/useWallet';

import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { useState } from 'react';
import BigNumber from 'bignumber.js';
import RichText from '../../libs/Prismic/components/RichText';
import config from '../../../config';
import useFilters from '../../hooks/useFilters';

const CommunityWrapper = styled(Grid)`
    > .grid-col:nth-child(2) {
        padding: 0;
    }
`;

const Divider = styled.hr`
    border: 1px solid ${colors.g200};
`;

const CommunityDetails = ({ community, data, claimsLocation, promoter }: any) => {
    const { gps = {}, contractAddress = null, status = '', state = {}, isPendingProposal = false, communitySocialMedia = [] } = community || {};
    const { contributed = 0, contributors = 0, beneficiaries = '0' } = state || {};
    const { maxClaim = 0, claimAmount = 0, incrementInterval = 0, baseInterval = 0 } = data || {};
    const { description = '', logoMediaPath = '', name = '', socialMedia = [] } = promoter || {};
    const { user } = useSelector(selectCurrentUser);
    const { address, connect } = useWallet();
    const [hasNoProposal, setHasNoProposal] = useState(isPendingProposal);
    const { addCommunity } = useImpactMarketCouncil();
    const isCouncilMember = user?.roles.includes('councilMember');
    const claims = claimsLocation?.length ? claimsLocation : [gps];
    const { update } = useFilters();

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            // ADD error to Prismic
            console.log('error');
        }
    };


    const addProposal = async () => {
        try {
            const response = await addCommunity({
                ambassador: community.ambassadorAddress,
                baseInterval,
                claimAmount: new BigNumber(claimAmount).shiftedBy(18).toString(), 
                decreaseStep: toToken(0.01),
                incrementInterval, 
                managers: [community.requestByAddress],
                maxClaim: new BigNumber(maxClaim).shiftedBy(18).toString(), 
                maxTranche: toToken(5, { EXPONENTIAL_AT: 25 }),
                minTranche: toToken(1),
                proposalDescription: `
                    ## Description:\n${ description }\n\n
                    UBI Contract Parameters:\n
                    Claim Amount: ${toNumber( new BigNumber(claimAmount).shiftedBy(18).toString() )}\n
                    Max Claim: ${toNumber( new BigNumber(maxClaim).shiftedBy(18).toString() )}\n
                    Base Interval: ${frequencyToText( +baseInterval )}\n
                    Increment Interval: ${ (+incrementInterval * 5) / 60 } minutes\n\n\n
                    More details: ${ config.baseUrl }/communities/${community.id}
                `,
                proposalTitle: `[New Community] ${community.name}`
            });

            console.log(response);
            setHasNoProposal(false);
            
            // TODO: ADD TO PRISMIC
            toast.success(
                <RichText content="Your request was generated successfully!" />
            );
        } catch (error) {
            console.log(error);
            
            toast.error(
                <RichText content="Your request was not generated!" />
            );
        } 
    };
    

    const cardAction = () => {
        const generateProposal = {
            action: () => addProposal(),
            type: 'generateProposal'
        };

        const contribute = {
            action: () => update('contribute', 0),
            type: 'contribute'
        };

        const connectWallet = {
            action: () => handleConnect(),
            type: 'connectWallet'
        };

        const loggedAction = status === 'pending' && hasNoProposal && isCouncilMember
                ? generateProposal
                : contribute;

        const button = !address ? connectWallet : loggedAction;

        return button;
    };

    const SocialLinks = ({ socials }: any) => {
        return socials?.map((social: any, index: number) => (
            <SocialLink 
                href={social.url}
                icon={social.mediaType}
                key={index}
                label={social.url}
            />
        ));
    };

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
                <Beneficiaries data={data} show={{ sm: 'flex', xs: 'none' }} />
            </CommunityWrapper>

            <Row mt={{sm: 1, xs: 2}}>
                <Col colSize={{ sm: 8, xs: 12 }} order={{ sm: 0, xs: 2 }} pr={{ sm: 2, xs: 1 }}>
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
                     - handle social icons
                    */}
                     
                     <Box fWrap="wrap" flex margin="1.5rem 0">
                        <SocialLinks socials={communitySocialMedia} />
                    </Box>

                    <Divider />
                    
                    {!!promoter && (
                        <Organization
                            created={dateHelpers.compact(community.createdAt)}
                            description={description}
                            image={logoMediaPath}
                            name={name}
                        />
                    )}

                    <Box fWrap="wrap" flex margin="1.5rem 0">
                        <SocialLinks socials={socialMedia} />
                    </Box>
                </Col>

                <Col colSize={{ sm: 4, xs: 12 }} fDirection={{ xs: 'column' }} flex pl={{ sm: 0 }}>
                    <Beneficiaries data={data} show={{ sm: 'none', xs: 'flex' }} />
                    {(status !== 'pending' || (status === 'pending' && hasNoProposal && isCouncilMember)) && (
                        <DonateCard
                            backers={contributors}
                            beneficiariesNumber={beneficiaries}
                            contractAddress={contractAddress}
                            goal={maxClaim * beneficiaries}
                            raised={contributed}
                            {...cardAction()}
                        />
                    )}
                </Col>
            </Row>
        </>
    );
};

export default CommunityDetails;
