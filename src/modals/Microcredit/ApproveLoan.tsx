import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    useModal,
} from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const ApproveLoan = () => {
    const { extractFromView } = usePrismicData();
    const {enterLoanMaturity, approveLoan} = extractFromView('messages') as any;

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
                    <RichText content={approveLoan} g900 large mt={1} semibold/>
                    <Input
                        placeholder={enterLoanMaturity[0].text}
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
                        {t('save')}
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default ApproveLoan;