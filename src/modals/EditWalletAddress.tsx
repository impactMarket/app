import {
    Box,
    Button,
    CircledIcon,
    ModalWrapper,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useLoanManager } from '@impact-market/utils';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useState } from 'react';
import Input from '../components/Input';
import RichText from '../libs/Prismic/components/RichText';
import processTransactionError from 'src/utils/processTransactionError';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const EditWalletAddress = () => {
    const { modals } = usePrismicData();
    const { t } = useTranslations();
    const {
        editWalletAddressTitle,
        editWalletAddressDescription,
        editWalletAddressPlaceholder,
        editWalletAddressSuccess,
        editWalletAddressError,
        editWalletAddressHint
    } = modals?.data;

    const [error, setError] = useState(false);
    const { handleClose, address } = useModal();
    const { control, handleSubmit } = useForm();
    const { isSubmitting } = useFormState({
        control
    });

    const { changeUserAddress } = useLoanManager();

    const handleCancel = (event: any) => {
        event.preventDefault();
        handleClose();
    };

    const onSubmit: SubmitHandler<any> = async (data) => {
        if (data?.address.toLowerCase() === address.toLowerCase()) {
            setError(true);
        } else {
            setError(false);

            try {
                const { status } = await changeUserAddress(
                    address,
                    data?.address
                );

                if (status) {
                    toast.success(editWalletAddressSuccess);
                    handleClose();
                } else {
                    toast.error(editWalletAddressError);
                }
            } catch (error) {
                console.log(error);
                toast.error(editWalletAddressError);

                processTransactionError(error, 'change_address');
            }
        }
    };

    return (
        <ModalWrapper maxW={'484px'} padding={2} w="100%">
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
                        <CircledIcon icon="edit" medium />
                        <RichText
                            content={editWalletAddressTitle}
                            g900
                            large
                            mt={1}
                            semibold
                            mb={0.5}
                        />
                        <RichText
                            content={editWalletAddressDescription}
                            g500
                            small
                            mb={1}
                        />
                        <Input
                            placeholder={editWalletAddressPlaceholder}
                            wrapperProps={{
                                w: '100%'
                            }}
                            rules={{
                                required: true
                            }}
                            control={control}
                            name="address"
                            withError={error}
                            hint={error && editWalletAddressHint}
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
                    >
                        <Button
                            gray
                            fluid={'xs'}
                            mt={{ sm: 1.5, xs: 1.5 }}
                            onClick={handleCancel}
                        >
                            {t('dismiss')}
                        </Button>
                        <Button
                            fluid={'xs'}
                            mt={{ sm: 1.5, xs: 0 }}
                            isLoading={isSubmitting}
                        >
                            {t('save')}
                        </Button>
                    </Box>
                </Box>
            </form>
        </ModalWrapper>
    );
};

export default EditWalletAddress;
