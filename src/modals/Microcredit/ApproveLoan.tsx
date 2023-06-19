import {
    Button,
    ModalWrapper,
    Text,
    useModal,
    Box,
    CircledIcon,
    Input
} from '@impact-market/ui';

const AddNote = () => {
    const { handleClose } = useModal();

    return (
        <ModalWrapper maxW={'484px'} padding={2.5} w="100%">
            <Box
                flex
                fDirection={{ sm: 'column', xs: 'column' }}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
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
                        Approve Loan
                    </Text>
                    <Input
                        placeholder="Enter loan maturity in months ...."
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
                        justifyContent: 'center',
                        alignItems: 'start',
                        gap: '1rem'
                    }}
                    w="50%"
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
                        Approve Loan
                    </Button>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default AddNote;
