import { Box, Button, Col, Divider, Row } from '@impact-market/ui';
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
            <Box pl={1} pr={1}>
                <label htmlFor="children">How many childrens do you have? (we will check this in person)</label>
                <br />
                <input id="children" {...register("children", { required: true })} defaultValue={auth?.user?.children} style={{ border: '1px solid black' }} />
                <br />
                {errors.children && <span>This field is required</span>}
                <br /><br />
            
            </Box>
            {
                isDirty && !isSubmitSuccessful &&
                <>
                    <Divider />
                    <Box pl={1} pr={1}>
                        <Row>
                            <Col colSize={12} right>
                                <Button default disabled={isSubmitting} gray mr={0.75} onClick={handleCancel}>
                                    <String id="cancel" />
                                </Button>
                                <Button default isLoading={isSubmitting} type="submit">
                                    <String id="saveChanges" />
                                </Button>
                            </Col>
                        </Row>
                    </Box>
                </>
            }
        </form>
    );
}

export default Form;