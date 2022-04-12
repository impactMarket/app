import { Box, Button, Col, Row, colors } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React, { useEffect } from "react";
import String from '../../../libs/Prismic/components/String';

type Inputs = {
    children: string
};

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { control, register, reset, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const handleCancel = () => {
        reset();
    }
    
    // TODO: colocar textos no prismic
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="children">How many childrens do you have? (we will check this in person)</label>
            <br />
            <input id="children" {...register("children", { required: true })} defaultValue={auth?.user?.children} style={{ border: '1px solid black' }} />
            <br />
            {errors.children && <span>This field is required</span>}
            <br /><br />

            {
                isDirty && !isSubmitSuccessful &&
                <Box mt={1.5}>
                    <Row style={{ borderTop: `1px solid ${colors.g200}` }}>
                        <Col colSize={12} right>
                            <Button default disabled={isSubmitting} gray mr={0.75} onClick={handleCancel}>
                                <String id="cancel" />
                            </Button>
                            <Button default isLoading={isSubmitting} type="submit">
                                Save changes
                            </Button>
                        </Col>
                    </Row>
                </Box>
            }
        </form>
    );
}

export default Form;