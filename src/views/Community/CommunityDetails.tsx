import {
    Box,
    Col,
    Grid,
    Row,
    colors,
    openModal,
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
import { translate } from '@impact-market/utils/translate';
import { useSelector } from 'react-redux';
import config from '../../../config';
import useWallet from '../../hooks/useWallet';

import { toToken } from '@impact-market/utils/toToken';
import { useEffect, useState } from 'react';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import Message from '../../libs/Prismic/components/Message';
import generateCommunityProposal from '../../helpers/generateCommunityProposal';

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
    const { contributed = 0, contributors = 0, beneficiaries = '0', baseInterval = 0 } = state || {};
    const { maxClaim = 0, claimAmount = 0 } = data || {};
    const { description = '', logoMediaPath = '', name = '', socialMedia = [] } = promoter || {};
    const { user } = useSelector(selectCurrentUser);
    const { address, connect } = useWallet();
    const [hasNoProposal, setHasNoProposal] = useState(isPendingProposal);
    const { addCommunity } = useImpactMarketCouncil();
    const isCouncilMember = user?.roles.includes('councilMember');
    const claims = claimsLocation?.length ? claimsLocation : [gps];
    const googleApiKey = config.googlePlacesKey;
    const [translatedText, setTranslatedText] = useState('')

    //  Translate description
    useEffect(() => {
        const translateDescription = async () => {
            try {
                const translation = await translate(community?.description, user?.language, { googleApiKey })
                
                setTranslatedText(translation?.translatedText)
            } catch (error) {
                console.log(error)
            }
        }

        translateDescription();
    }, [])

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            toast.error(
                <Message id="errorOccurred" />
            );
        }
    };

    const addProposal = async () => {
        try {
            await addCommunity({
                ...generateCommunityProposal(community, data),
                claimAmount: toToken(claimAmount, { EXPONENTIAL_AT: 25 }),
                maxClaim: toToken(maxClaim, { EXPONENTIAL_AT: 25 })
            });

            setHasNoProposal(false);

            toast.success(
                <Message id="generatedSuccess" />
            );
        } catch (error) {
            toast.error(
                <Message id="generatedError" />
            );
        }
    };

    const cardAction = () => {
        const generateProposal = {
            action: () => addProposal(),
            type: 'generateProposal'
        };

        const contribute = {
            action: () => openModal('contribute', {
                contractAddress,
                value: null
            }),
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
                href={social?.url}
                icon={social?.mediaType}
                key={index}
                label={social?.url}
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
                            h={400}
                            src={community?.coverMediaPath}
                            w={400}
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
                <Beneficiaries data={{...data, baseInterval}} show={{ sm: 'flex', xs: 'none' }} />
            </CommunityWrapper>

            <Row mt={{sm: 1, xs: 2}}>
                <Col colSize={{ sm: 8, xs: 12 }} order={{ sm: 0, xs: 2 }} pr={{ sm: 2, xs: 1 }}>
                    <Trim
                        g800
                        large
                        limit={100}
                        message={translatedText}
                        pb={0}
                        pt={0}
                        rows={4}
                    />
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
                    <Beneficiaries data={{...data, baseInterval}} show={{ sm: 'none', xs: 'flex' }} />
                    {(status !== 'pending' || (status === 'pending' && hasNoProposal && isCouncilMember)) && (
                        <DonateCard
                            backers={contributors}
                            beneficiariesNumber={beneficiaries.toString()}
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
