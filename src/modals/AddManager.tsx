import {
    Box,
    Button,
    CircledIcon,
    Col,
    Input,
    ModalWrapper,
    Row,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import Message from '../libs/Prismic/components/Message';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';


const AddManager = () => {
    const { handleClose } = useModal();

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            address: ''
        }
    });
    const { isSubmitting } = useFormState({ control });
    
    const onSubmit: SubmitHandler<any> = () => {
        try {
            //  Todo: all the logic (add manager)
            // eslint-disable-next-line no-alert
            alert('In progress')
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);
        }
    };


    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="flash" large />
            <RichText
                content="Add Manager"
                large
                mt={1.25}
                semibold
            />
            {/* Todo: Add texts on Prismic */}
            <RichText
                content="The new manager will receive a notification and can immediatly start adding new beneficiaries."
                g500
                mt={0.5}
                small
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={1.25}>
                    <Input
                        control={control}
                        hint={errors?.address ? 'This field is required' : ''}
                        label="Add manager address"
                        name="address"
                        rules={{ required: true }}
                        withError={!!errors?.address}
                    />
                </Box>
                <Row mt={1}>
                    <Col colSize={{ sm: 6, xs: 6 }}>
                        <Button disabled={isSubmitting} gray onClick={handleClose} type="button" w="100%">
                            <RichText
                                content="Cancel"
                            />
                        </Button>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }}>
                        <Button disabled={isSubmitting} isLoading={isSubmitting} type="submit" w="100%">
                            <RichText
                                content= "Add Manager"                       
                            />
                        </Button>
                    </Col>
                </Row>
            </form>
        </ModalWrapper>
    );
};

export default AddManager
