import { Box, Button, Col, Divider, Row } from '@impact-market/ui';
import { getCountryFromPhoneNumber } from '../../../utils/country';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import React, { useEffect } from "react";
import String from '../../../libs/Prismic/components/String';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

type Inputs = {
    firstName: string,
    lastName: string,
    age: number,
    bio: string,
    gender: string
};

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

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

    // TODO: reset it's not working with the inputs from UI
    const handleCancel = () => {
        reset();
    }   
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Row>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        {/* TODO: check this type error, it's still working */}
                        <Input 
                            defaultValue={auth?.user?.firstName}
                            label={t('firstName')}
                            {...register("firstName")}
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        <Input 
                            defaultValue={auth?.user?.lastName}
                            label={t('lastName')}
                            {...register("lastName")}
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        <Input 
                            defaultValue={auth?.user?.age}
                            label={t('age')}
                            type="number"
                            {...register("age")}
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        { /* TODO: finish Gender field */ }
                        <p><String id="gender" /></p>
                        <label htmlFor="male"><String id="male" /></label>
                        <input id="male" {...register("gender")} type="radio" value="m" />
                        <br />
                        <label htmlFor="female"><String id="female" /></label>
                        <input id="female" {...register("gender")} type="radio" value="f" />
                        <br />
                        <label htmlFor="other"><String id="other" /></label>
                        <input id="other" {...register("gender")} type="radio" value="o" />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={12}>
                        <Input 
                            defaultValue={auth?.user?.bio}
                            label={t('bio')}
                            // TODO: colocar texto no prismic
                            placeholder="Write a short introduction."
                            rows={6}
                            {...register("bio")}
                        />
                    </Col>
                </Row>

                { /* TODO: finish Country field */ }
                <Row mt={0.5}>
                    <Col colSize={12}>
                        <label><String id="country" /></label>
                        <br />
                        <div>{getCountryFromPhoneNumber('+37060112345')}</div>
                    </Col>
                </Row>

                {/* <label htmlFor="firstName"><String id="firstName" /></label>
                <br />
                <input id="firstName" {...register("firstName", { required: true })} defaultValue={auth?.user?.firstName} style={{ border: '1px solid black' }} />
                <br />
                {errors.firstName && <span>This field is required</span>}
                <br /><br />
                
                <label htmlFor="lastName"><String id="lastName" /></label>
                <br />
                <input id="lastName" {...register("lastName", { required: true })} defaultValue={auth?.user?.lastName} style={{ border: '1px solid black' }} />
                <br />    
                {errors.lastName && <span>This field is required</span>}
                <br /><br />
                
                <label htmlFor="age"><String id="age" /></label>
                <br />
                <input id="age" type="number" {...register("age", { required: true })} defaultValue={auth?.user?.age} style={{ border: '1px solid black' }} />
                <br />
                {errors.age && <span>This field is required</span>}
                <br /><br />
                
                <label htmlFor="bio"><String id="bio" /></label>
                <br />
                <textarea id="bio" {...register("bio")} defaultValue={auth?.user?.bio} style={{ border: '1px solid black' }} />
                <br /><br /> */}
                
                {/* <p><String id="gender" /></p>
                <label htmlFor="male"><String id="male" /></label>
                <input id="male" {...register("gender")} type="radio" value="m" />
                <br />
                <label htmlFor="female"><String id="female" /></label>
                <input id="female" {...register("gender")} type="radio" value="f" />
                <br />
                <label htmlFor="other"><String id="other" /></label>
                <input id="other" {...register("gender")} type="radio" value="o" />
                <br /><br /> */}
            </Box>
            {
                isDirty && !isSubmitSuccessful &&
                <>
                    <Divider/>
                    <Box pl={1.5} pr={1.5}>
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