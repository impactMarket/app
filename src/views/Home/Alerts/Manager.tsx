import { Alert, Button, toast } from '@impact-market/ui';
import { currencyFormat } from '../../../utils/currencies';
import { handleKnownErrors } from '../../../helpers/handleKnownErrors';
import { selectCurrentUser } from '../../../state/slices/auth';
import { toNumber } from '@impact-market/utils/toNumber';
import { useManager } from '@impact-market/utils';
import { useSelector } from 'react-redux';
import Message from '../../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import processTransactionError from '../../../utils/processTransactionError';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const ManagerAlerts = () => {
    const [loading, setLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [fundsReceived, setFundsReceived] = useState(0);

    const { t } = useTranslations();
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });

    const {
        canRequestFunds,
        community: { hasFunds },
        fundsRemainingDays,
        requestFunds,
        isReady
    } = useManager(auth?.user?.manager?.community);

    const requestMoreFunds = async () => {
        try {
            setLoading(true);

            toast.info(<Message id="approveTransaction" />);
            const response = await requestFunds();

            setFundsReceived(response);

            setLoading(false);

            // TODO: on success, setFundsReceived with the received value
            setRequestSuccess(true);
        } catch (error) {
            handleKnownErrors(error);
            processTransactionError(error, 'request_funds');

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
            {isReady && (
                <>
                    {!hasFunds && (
                        <Alert
                            button={renderButton()}
                            error={!requestSuccess}
                            icon="alertCircle"
                            mb={1}
                            message={
                                <Message id="beneficiariesNotAllowance" small />
                            }
                            system={requestSuccess}
                            title={t('communityRunOutOfFunds')}
                        />
                    )}
                    {fundsRemainingDays > 0 && fundsRemainingDays <= 3 && (
                        <Alert
                            button={renderButton()}
                            icon="alertTriangle"
                            mb={1}
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
                            mb={1}
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
            )}
        </>
    );
};

export default ManagerAlerts;
