import * as Sentry from '@sentry/nextjs';
import {
    Box,
    Button,
    CircledIcon,
    ModalWrapper,
    toast,
    useModal
} from '@impact-market/ui';
import {
    SubmitHandler,
    useForm,
    useFormState,
    useWatch
} from 'react-hook-form';
import { handleKnownErrors } from 'src/helpers/handleKnownErrors';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Input from '../../components/Input';
import Message from 'src/libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const ApproveLoan = () => {
    const { extractFromView } = usePrismicData();
    const {
        enterLoanMaturity,
        approveLoan,
        loansApproved,
        loanMaturityHint,
        enterLoanAmount
    } = extractFromView('messages') as any;

    const { handleClose, address, mutate } = useModal();
    const { t } = useTranslations();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: { amount: '', period: '' } });
    const { isDirty, isSubmitting } = useFormState({
        control
    });

    const period = useWatch({
        control,
        name: 'period'
    });

    const amount = useWatch({
        control,
        name: 'amount'
    });

  
    const { addLoans, managerDetails } = useLoanManager();

    const validatePeriod =
        parseInt(period, 10) > 12 || parseInt(period, 10) <= 0;
    const validateAmount =
        parseInt(amount, 10) >
            managerDetails?.currentLentAmountLimit -
                managerDetails?.currentLentAmount || parseInt(amount, 10) <= 0;

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            Sentry.captureMessage(`addLoan -> userAddress: ${address}`);

            let loans;

            if (Array.isArray(address)) {
                loans = address.map((addr) => ({
                    amount: parseInt(data?.amount, 10),
                    claimDeadline: Math.floor(
                        new Date(new Date().getTime() + 1209600000).getTime() /
                            1000
                    ),
                    dailyInterest: 0.1,
                    period: parseInt(data?.period, 10) * 2592000,
                    userAddress: addr
                }));
            } else {
                loans = [
                    {
                        amount: parseInt(data?.amount, 10),
                        claimDeadline: Math.floor(
                            new Date(
                                new Date().getTime() + 1209600000
                            ).getTime() / 1000
                        ),
                        dailyInterest: 0.1,
                        period: parseInt(data?.period, 10) * 2592000,
                        userAddress: address
                    }
                ];
            }

            
            const { status } = await addLoans(loans);

            if (status) {
                mutate();
                toast.success(loansApproved);
                handleClose();
            } else {
                toast.error(<Message id="errorOccurred" />);
            }
        } catch (error) {
            console.log(error);
            handleKnownErrors(error);
            processTransactionError(error, 'accept_loan');
        }
    };

    return (
        <ModalWrapper maxW={'484px'} padding={2.5} w="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                    flex
                    fDirection={{ sm: 'column', xs: 'column' }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Box
                        flex
                        fDirection={{ sm: 'column', xs: 'column' }}
                        style={{
                            justifyContent: 'start'
                        }}
                        w="100%"
                    >
                        <CircledIcon icon="check" medium />
                        <RichText
                            content={approveLoan}
                            g900
                            large
                            mt={1}
                            semibold
                        />
                        <Input
                            type="number"
                            placeholder={enterLoanMaturity[0].text}
                            wrapperProps={{
                                mt: 1,
                                w: '100%'
                            }}
                            rules={{
                                required: true
                            }}
                            control={control}
                            name="period"
                            withError={!!errors?.period}
                            hint={loanMaturityHint}
                        />
                        <Input
                            type="number"
                            placeholder={enterLoanAmount}
                            wrapperProps={{
                                mt: 1,
                                w: '100%'
                            }}
                            suffix="cUSD"
                            rules={{
                                required: true
                            }}
                            control={control}
                            name="amount"
                            withError={!!errors?.amount}
                            hint={`Max. ${
                                managerDetails?.currentLentAmountLimit -
                                managerDetails?.currentLentAmount
                            } cUSD`}
                        />
                    </Box>

                    <Box
                        flex
                        fDirection={{ sm: 'row', xs: 'column' }}
                        style={{
                            alignItems: 'start',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}
                        w="50%"
                    >
                        <Button
                            gray
                            fluid={'xs'}
                            mt={{ sm: 1.5, xs: 1.5 }}
                            onClick={() => handleClose()}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            fluid={'xs'}
                            mt={{ sm: 1.5, xs: 0 }}
                            disabled={
                                isSubmitting ||
                                !isDirty ||
                                !period ||
                                !amount ||
                                validateAmount ||
                                validatePeriod
                            }
                            isLoading={isSubmitting}
                        >
                            {approveLoan}
                        </Button>
                    </Box>
                </Box>
            </form>
        </ModalWrapper>
    );
};

export default ApproveLoan;
