import { Box, Button, Col, Row, colors } from '@impact-market/ui';
import { getCountryFromPhoneNumber } from '../../../utils/country';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React, { useEffect } from "react";
import String from '../../../libs/Prismic/components/String';

type Inputs = {
    firstName: string,
    lastName: string,
    age: number,
    bio: string,
    gender: string
};

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { control, register, reset, handleSubmit, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            gender: auth?.user?.gender
        }
    });
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const handleCancel = () => {
        reset();
    }   
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstName">First Name</label>
            <br />
            <input id="firstName" {...register("firstName", { required: true })} defaultValue={auth?.user?.firstName} style={{ border: '1px solid black' }} />
            <br />
            {errors.firstName && <span>This field is required</span>}
            <br /><br />
            
            <label htmlFor="lastName">Last Name</label>
            <br />
            <input id="lastName" {...register("lastName", { required: true })} defaultValue={auth?.user?.lastName} style={{ border: '1px solid black' }} />
            <br />    
            {errors.lastName && <span>This field is required</span>}
            <br /><br />
            
            <label htmlFor="age">Age</label>
            <br />
            <input id="age" type="number" {...register("age", { required: true })} defaultValue={auth?.user?.age} style={{ border: '1px solid black' }} />
            <br />
            {errors.age && <span>This field is required</span>}
            <br /><br />
            
            <label htmlFor="bio">Bio</label>
            <br />
            <textarea id="bio" {...register("bio")} defaultValue={auth?.user?.bio} style={{ border: '1px solid black' }} />
            <br /><br />
            
            <p>Gender</p>
            <label htmlFor="male">Male</label>
            <input id="male" {...register("gender")} type="radio" value="m" />
            <br />
            <label htmlFor="female">Female</label>
            <input id="female" {...register("gender")} type="radio" value="f" />
            <br />
            <label htmlFor="other">Other</label>
            <input id="other" {...register("gender")} type="radio" value="o" />
            <br /><br />
            
            <label>Country</label>
            <br />
            <div>{getCountryFromPhoneNumber('+37060112345')}</div>
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