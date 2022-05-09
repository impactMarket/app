import { Alert, Button, toast } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useManager } from '@impact-market/utils';
import { useSelector } from 'react-redux';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Alerts: React.FC<{ fundsRemainingDays: number; hasFunds: boolean; }> = props => {
    const { fundsRemainingDays, hasFunds } = props;
    const [loading, setLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [fundsReceived] = useState(0);
    
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();
    
    const { requestFunds } = useManager(
        auth?.user?.manager?.community
    );

    const requestMoreFunds = async () => {
        try {
            setLoading(true);

            await requestFunds();

            setLoading(false);

            // TODO: on success, setFundsReceived with the received value
            setRequestSuccess(true);
        }
        catch(error: any) {
            console.log(error);

            setLoading(false);
            
            // TODO: add error messages according to the error
            toast.error(<Message id="errorOccurred" />);
        }
    };

    const renderButton = () => {
        const state = requestSuccess ? { gray: true } : { default: true };

        return (
            <Button 
                disabled={loading} 
                icon={requestSuccess ? 'checkCircle' : 'plus'} 
                isLoading={loading} 
                onClick={() => !requestSuccess && requestMoreFunds()}
                reverse={requestSuccess}
                {...state}
            >
                {requestSuccess ? t('fundsRequested') : t('requestMoreFunds')}
            </Button>
        );
    };
    
    return (
        <>
            {!hasFunds && 
                <Alert 
                    button={renderButton()} 
                    error={!requestSuccess}
                    icon="alertCircle" 
                    mb={1.25} 
                    message={<Message id="beneficiariesNotAllowance" small />}
                    system={requestSuccess}
                    title={t('communityRunOutOfFunds')}
                />
            }
            {fundsRemainingDays <= 3 && fundsRemainingDays > 0 &&
                <Alert 
                    button={renderButton()}
                    icon="alertTriangle" 
                    mb={1.25} 
                    message={<Message id="communityFundsRunOutIn" small variables={{ count: fundsRemainingDays, timeUnit: t("days").toLowerCase() }} />}
                    system={requestSuccess}
                    title={t('communityFundsRunningOut')}
                    warning={!requestSuccess}
                />
            }
            {requestSuccess &&
                /* TODO: Use currencyFormat when showing the funds value */
                <Alert 
                    icon="checkCircle" 
                    mb={1.25} 
                    success 
                    title={<Message id="communityReceivedFromDAO" medium small variables={{ value: fundsReceived }} />}
                />
            }
        </>
    );
};

export default Alerts;
