import {
    Box,
    Button,
    CircledIcon,
    Input,
    ModalWrapper,
    Text,
    useModal,
} from '@impact-market/ui';

const ApproveLoan = () => {
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

export default ApproveLoan;
