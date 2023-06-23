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
                        Add Note
                    </Text>
                    <Input
                        placeholder="Describe your conversation with borrower ..."
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
                        Dismiss
                    </Button>
                    <Button
                        fluid={'xs'}
                        mt={{ sm: 1.5, xs: 0 }}
                        onClick={() => handleClose()}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default AddNote;
