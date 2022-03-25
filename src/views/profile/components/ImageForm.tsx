import { Box, Button, Col, Row, colors } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React from "react";
import String from '../../../libs/Prismic/components/String';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { control, register, handleSubmit, formState: { errors } } = useForm<any>();
    const { isSubmitting } = useFormState({ control });
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="img">Image</label>
            <br />
            <input id="img" type="file" {...register("img", { required: true })} accept="image/*" />
            <br />
            {errors.img && <span>This field is required</span>}
            <br /><br />
            
            <Box mt={1.5}>
                <Row style={{ borderTop: `1px solid ${colors.g200}` }}>
                    <Col colSize={12} right>
                        <Button default isLoading={isSubmitting} type="submit">
                            Save changes
                        </Button>
                    </Col>
                </Row>
            </Box>
        </form>
    );
}

export default Form;