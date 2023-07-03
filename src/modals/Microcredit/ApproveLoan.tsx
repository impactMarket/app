import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    Text,
    useModal,
} from '@impact-market/ui';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const ApproveLoan = () => {

    const { handleClose } = useModal();
    const { t } = useTranslations();

    return (
        <ModalWrapper maxW={'484px'} padding={2.5} w="100%">
            <Box
                flex
                fDirection={{ sm: 'column', xs: 'column' }}
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    <Text g900 large mt={1} semibold>
                        {t('approveLoan')}
                    </Text>
                    <Input
                        placeholder={t("enterLoanMaturity")}
                        rows={1}
                        wrapperProps={{
                            mt: 1,
                            w: '100%'
                        }}
                    />
                </Box>

                <Box
                    flex
                    fDirection={{ sm: 'row', xs: 'column' }}
                    style={{
                        alignItems: 'start',
                        gap: '1rem',
                        justifyContent: 'center',
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
                    >
                        {t('approve')}
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default ApproveLoan;
