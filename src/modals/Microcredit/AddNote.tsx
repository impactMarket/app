import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    toast,
    useModal,
} from '@impact-market/ui';
import {
    Controller,
    SubmitHandler,
    useForm,
    useFormState,
    useWatch
} from 'react-hook-form';
import { useEffect, useState } from 'react';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Message from 'src/libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';
import useAddNote from '../../hooks/useAddNote';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const AddNote = () => {

    const { extractFromView } = usePrismicData();
    const {describeConvBorrower, addNote} = extractFromView('messages') as any;

    const { handleClose } = useModal();
    const { t } = useTranslations();

    const {
        handleSubmit,
        control
    } = useForm({ defaultValues: { noteText: '' } });

    const noteText = useWatch({
        control,
        name: 'noteText'
    });

    const { isDirty, isSubmitting } = useFormState({
        control,
        name: 'noteText'
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { addNote: addNotePost } = useAddNote(() => {
        setSubmitSuccess(true);
        handleClose();
    });

    const onSubmit: SubmitHandler<any> = async (data) => {
        
        try {
            const d = await addNotePost(data.noteText);

            console.log("response: ",d);
            toast.success('Note Added');
        } catch (error) {
            toast.error(<Message id="errorOccurred" />);
        }
    };

    useEffect(() => {
        if (submitSuccess) {
            handleClose();
        }
    }, [submitSuccess]);

    return (
        <ModalWrapper maxW={'484px'} padding={2.5} w="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        <Controller
                            control={control}
                            name="noteText"
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder={`${describeConvBorrower[0].text}`}
                                    rows={4}
                                    wrapperProps={{
                                        mt: 1,
                                        w: '100%'
                                    }}
                                />
                            )}
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
                            type="button"
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            fluid={'xs'}
                            mt={{ sm: 1.5, xs: 0 }}
                            type="submit"
                            disabled={ isSubmitting || !noteText || !isDirty}
                            onClick={() => handleClose()}
                        >
                            {t('save')}
                        </Button>
                    </Box>
                </Box>
            </form>
        </ModalWrapper>
    );
};

export default AddNote;