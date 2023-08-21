import * as Sentry from '@sentry/browser';
import { Alert, Button, toast } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';
import { toNumber } from '@impact-market/utils/toNumber';
import { useSelector } from 'react-redux';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Alerts: React.FC<{
    canRequestFunds: boolean;
    fundsRemainingDays: number;
    hasFunds: boolean;
    requestFunds: Function;
}> = (props) => {
    const { canRequestFunds, fundsRemainingDays, hasFunds, requestFunds } =
        props;
    const [loading, setLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [fundsReceived, setFundsReceived] = useState('0');

    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });

    const { t } = useTranslations();

    const requestMoreFunds = async () => {
        try {
            setLoading(true);

            const response = await requestFunds();

            setFundsReceived(response);

            setLoading(false);

            // TODO: on success, setFundsReceived with the received value
            setRequestSuccess(true);
        } catch (error: any) {
            console.log(error);
            Sentry.captureException(error);

            setLoading(false);

            // TODO: add error messages according to the error
            toast.error(<Message id="errorOccurred" />);
        }
    };

    const renderButton = () => {
        const state = requestSuccess ? { gray: true } : { default: true };

        return (
            <Button
                disabled={!canRequestFunds || loading}
                icon={requestSuccess ? 'checkCircle' : 'plus'}
                isLoading={loading}
                onClick={() =>
                    !requestSuccess && canRequestFunds && requestMoreFunds()
                }
                reverse={requestSuccess}
                {...state}
            >
                {requestSuccess ? t('fundsRequested') : t('requestMoreFunds')}
            </Button>
        );
    };

    return (
        <>
            {!hasFunds && (
                <Alert
                    button={renderButton()}
                    error={!requestSuccess}
                    icon="alertCircle"
                    mb={1.25}
                    message={<Message id="beneficiariesNotAllowance" small />}
                    system={requestSuccess}
                    title={t('communityRunOutOfFunds')}
                />
            )}
            {fundsRemainingDays > 0 && fundsRemainingDays <= 3 && (
                <Alert
                    button={renderButton()}
                    icon="alertTriangle"
                    mb={1.25}
                    message={
                        <Message
                            id="communityFundsRunOutIn"
                            small
                            variables={{
                                count: fundsRemainingDays,
                                timeUnit: t('days').toLowerCase()
                            }}
                        />
                    }
                    system={requestSuccess}
                    title={t('communityFundsRunningOut')}
                    warning={!requestSuccess}
                />
            )}
            {requestSuccess && (
                /* TODO: Use currencyFormat when showing the funds value */
                <Alert
                    icon="checkCircle"
                    mb={1.25}
                    success
                    title={
                        <Message
                            id="communityReceivedFromDAO"
                            medium
                            small
                            variables={{
                                value: () =>
                                    currencyFormat(
                                        toNumber(fundsReceived),
                                        localeCurrency
                                    )
                            }}
                        />
                    }
                />
            )}
        </>
    );
};

export default Alerts;
