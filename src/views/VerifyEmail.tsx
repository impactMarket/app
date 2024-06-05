import { Box, Button, Text, toast, ViewContainer } from '@impact-market/ui';
import React, { useEffect, useState } from 'react';
import { useVerifyEmailMutation } from 'src/api/user';
import CheckPermission from 'src/components/CheckPermission';
import useFilters from 'src/hooks/useFilters';

const VerifyEmail: React.FC<{ isLoading?: boolean }> = () => {
    const { getByKey, update } = useFilters();
    const [isLoading, setIsLoading] = useState(false);
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const [verifyEmail] = useVerifyEmailMutation();

    useEffect(() => {
        if (getByKey('verified')) {
            setEmailConfirmed(true);
        }
    }, [getByKey('verified')]);

    const confirmVerification = async () => {
        try {
            setIsLoading(true);

            await verifyEmail({
                code: getByKey('code'),
                email: getByKey('email'),
                userId: getByKey('userId')
            }).unwrap();

            update('verified', 1);
            setIsLoading(false);
            setEmailConfirmed(true);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again later.');
            setIsLoading(false);
        }
    };

    const showPage =
        !!getByKey('code') && !!getByKey('email') && !!getByKey('userId');

    if (!showPage) {
        return <CheckPermission />;
    }

    return (
        <ViewContainer {...({} as any)}>
            <Box
                column
                fLayout="start"
                flex
                style={{ gap: '2rem', maxWidth: '500px', margin: '0 auto' }}
            >
                <img
                    alt="impactMarket logo"
                    src="/img/logo.svg"
                    width="125px"
                />
                <div>
                    <Text
                        g900
                        semibold
                        style={{ fontSize: '1.5rem', lineHeight: '2rem' }}
                    >
                        {emailConfirmed
                            ? 'Email Confirmed.'
                            : 'Confirm your email.'}
                    </Text>
                    <Text g500 large mt="0.5rem">
                        {emailConfirmed
                            ? 'Thanks for confirming your email. You can now close this page and go back to claim your rewards.'
                            : 'In order to be able to claim your rewards, please confirm your email by clicking the button below.'}
                    </Text>
                </div>
                {!emailConfirmed && (
                    <Box flex>
                        <Button
                            isLoading={isLoading}
                            onClick={confirmVerification}
                        >
                            <Text>Confirm Email Address</Text>
                        </Button>
                    </Box>
                )}
            </Box>
        </ViewContainer>
    );
};

export default VerifyEmail;
