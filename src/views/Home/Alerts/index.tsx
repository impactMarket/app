import { Alert, Box, Button } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import BeneficiaryAlerts from './Beneficiary';
import DonorAlerts from './Donor';
import ManagerAlerts from './Manager';
import Message from '../../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import String from '../../../libs/Prismic/components/String';
import useWallet from '../../../hooks/useWallet';

const Alerts = () => {
    const { user } = useSelector(selectCurrentUser);
    const userRoles = user?.roles;
    const { push } = useRouter();
    const [isConnecting, setIsConnecting] = useState(false);

    const { connect } = useWallet();

    const connectWallet = () => {
        const handleConnectClick = async () => {
            setIsConnecting(true);

            await connect();

            setIsConnecting(false);

            push('/');
        };

        return (
            <Button isLoading={isConnecting} onClick={handleConnectClick}>
                <String id="connectWallet" />
            </Button>
        );
    };

    return (
        <Box w="100%" style={{ padding: '0.5rem 0.5rem 0 0.5rem' }}>
            {!user && (
                <Alert
                    button={connectWallet()}
                    icon="coins"
                    mb={1}
                    message={<Message id="personalizeShortcuts" small g800 />}
                    title={<Message id="welcome" semibold extralarge g800 />}
                />
            )}
            {userRoles?.includes('donor') && <DonorAlerts />}
            {userRoles?.includes('manager') && <ManagerAlerts />}
            {userRoles?.includes('beneficiary') && <BeneficiaryAlerts />}
        </Box>
    );
};

export default Alerts;
