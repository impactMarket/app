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
import { useEffect } from 'react';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Input from '../../components/Input';
import Message from 'src/libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const ApproveLoan = () => {
    const { extractFromView } = usePrismicData();
    const { enterLoanMaturity, approveLoan } = extractFromView(
        'messages'
    ) as any;

    const { handleClose, address, mutate } = useModal();
    const { t } = useTranslations();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({ defaultValues: { amount: '', period: '' } });
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({
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

    const { addLoans: addLoansNow } = useLoanManager();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            // setIsLoading(false);

            Sentry.captureMessage(`addLoan -> userAddress: ${address}`);

            let addressArray = address;
            const amounts = [];
            const periods = [];
            const dailyInterests = [];
            const startDates = [];

            if (Array.isArray(address)) {
                address.forEach(() => {
                    amounts.push(parseInt(data?.amount, 10));
                    periods.push(parseInt(data?.period, 10) * 2592000);
                    dailyInterests.push(0.1);
                    startDates.push(
                        Math.floor(
                            new Date(
                                new Date().getTime() + 1209600000
                            ).getTime() / 1000
                        )
                    );
                });
            } else {
                amounts.push(parseInt(data?.amount, 10));
                periods.push(parseInt(data?.period, 10) * 2592000);
                dailyInterests.push(0.1);
                startDates.push(
                    Math.floor(
                        new Date(new Date().getTime() + 1209600000).getTime() /
                            1000
                    )
                );
                addressArray = [address];
            }

            // @ts-ignore
            const { status } = await addLoansNow(
                addressArray,
                amounts,
                periods,
                dailyInterests,
                startDates
            );

            if (status) {
                mutate();
                handleClose();

                // setIsLoading(false);

                toast.success('Loan Approved');
            } else {
                toast.error(<Message id="errorOccurred" />);
            }

            // return setIsLoading(false);
        } catch (error) {
            console.log(error);
            handleKnownErrors(error);
            processTransactionError(error, 'accept_loan');
        }
    };

    useEffect(() => {
        if (isSubmitSuccessful) {
            handleClose();
        }
    }, [isSubmitSuccessful]);

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
                            placeholder={enterLoanMaturity[0].text}
                            wrapperProps={{
                                mt: 1,
                                w: '100%'
                            }}
                            rules={{ required: true }}
                            control={control}
                            name="period"
                            withError={!!errors?.period}
                            hint={errors?.period ? t('requiredField') : ''}
                        />
                        <Input
                            placeholder="Enter loan amount..."
                            wrapperProps={{
                                mt: 1,
                                w: '100%'
                            }}
                            suffix="cUSD"
                            rules={{ required: true }}
                            control={control}
                            name="amount"
                            withError={!!errors?.amount}
                            hint={errors?.amount ? t('requiredField') : ''}
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
                            onClick={() => handleClose()}
                            disabled={
                                isSubmitting || !isDirty || !period || !amount
                            }
                            isLoading={isSubmitting}
                        >
                            Approve Loan
                        </Button>
                    </Box>
                </Box>
            </form>
        </ModalWrapper>
    );
};

export default ApproveLoan;