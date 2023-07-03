import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    useModal,
} from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import RichText from '../../libs/Prismic/components/RichText';

const AddNote = () => {
    
    const { extractFromView } = usePrismicData();
    const {describeConvBorrower, addNote} = extractFromView('messages') as any;
    const { handleClose } = useModal();
    const { t } = useTranslations();
    console.log("Describe",describeConvBorrower);
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
                    <RichText content={addNote} g900 large mt={1} semibold/>
                    <Input
                        placeholder={`${describeConvBorrower[0].text}`}
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

