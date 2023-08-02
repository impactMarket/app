import {
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    toast,
    useModal
} from '@impact-market/ui';
import { selectCurrentUser } from '../state/slices/auth';
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Message from '../libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import config from '../../config';
import processTransactionError from 'src/utils/processTransactionError';
import router from 'next/router';

const RemoveCommunity = () => {
    const { user } = useSelector(selectCurrentUser);
    const { removeCommunity } = useImpactMarketCouncil();
    const { handleClose, community, thegraphData } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const { modals } = usePrismicData();

    // Check if current User has access to this modal
    if (!user.councilMember) {
        router.push('/communities');

        return null;
    }

    const handleRemove = async () => {
        try {
            setIsLoading(true);

            toast.info(<Message id="approveTransaction" />);

            await removeCommunity({
                communityAddress: community?.contractAddress,
                proposalDescription: `## Description:
                ${community?.description}
        
                UBI Contract Parameters:
                Claim Amount: ${thegraphData?.claimAmount}
                Max Claim: ${thegraphData?.maxClaim}
                Base Interval: ${thegraphData?.baseInterval}
                Increment Interval: ${thegraphData?.incrementInterval}
        
        
                More details: ${config.baseUrl}/communities/${community?.id}`,
                proposalTitle: `[Remove Community] ${community?.name}`
            });

            setIsLoading(false);
            toast.success(modals?.data?.removeCommunitySuccess);

            handleClose();
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'remove_community');

            setIsLoading(false);
            toast.error(modals?.data?.removeCommunityError);
        }
    };

    console.log(modals);

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="alertTriangle" large error />
            <RichText
                content={modals?.data?.removeCommunityTitle}
                large
                mt={1.25}
                semibold
            />
            <RichText
                content={modals?.data?.removeCommunityDescription}
                g500
                mt={0.5}
                small
            />
            <Row mt={1}>
                <Col colSize={{ sm: 6, xs: 6 }} pr={0.5}>
                    <Button gray onClick={() => handleClose()} w="100%">
                        <RichText
                            content={modals?.data?.createStoryCancelButtonLabel}
                        />
                    </Button>
                </Col>

                <Col colSize={{ sm: 6, xs: 6 }} pl={0.5}>
                    <Button
                        isLoading={isLoading}
                        onClick={handleRemove}
                        w="100%"
                        error
                        icon="trash"
                    >
                        <String id="removeCommunity" />
                    </Button>
                </Col>
            </Row>
        </ModalWrapper>
    );
};

export default RemoveCommunity;
