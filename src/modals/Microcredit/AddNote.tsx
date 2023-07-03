import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    Text,
    useModal,
} from '@impact-market/ui';



const AddNote = () => {
    

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
                    <CircledIcon icon="upload" medium />
                    <Text g900 large mt={1} semibold>
                        {t('addNote')}
                    </Text>
                    <Input
                        placeholder={t("describeConv") + " " + t("borrower")}
                        rows={4}
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
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'center',
                    }}
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
                        {t('save')}
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default AddNote;
