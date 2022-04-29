/* eslint-disable sort-keys */
import { Box, Col, Row } from '@impact-market/ui';
import { countriesOptions } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from "react";
import Select from '../../components/Select';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const genders = [
        { label: t('male'), value: 'm' },
        { label: t('female'), value: 'f' },
        { label: t('other'), value: 'o' }
    ];

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            age: auth?.user?.age,
            bio: auth?.user?.bio,
            country: auth?.user?.country,
            firstName: auth?.user?.firstName,
            gender: auth?.user?.gender,
            lastName: auth?.user?.lastName
        }
    });
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset(getValues());
        }
    }, [isSubmitSuccessful]);

    const handleCancel = (e: any) => {
        e.preventDefault();
        reset();
    } 
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Row>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        <Input 
                            control={control}
                            label={t('firstName')}
                            name="firstName"
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        <Input 
                            control={control}
                            label={t('lastName')}
                            name="lastName"
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        <Input 
                            control={control}
                            label={t('age')}
                            name="age"
                            type="number"
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        <Select
                            control={control}
                            isMultiple={false}
                            label={t('gender')}
                            name="gender"
                            options={genders}
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={12}>
                        { /* TODO: colocar textos no prismic */ }
                        <Input 
                            control={control}
                            label={t('bio')}
                            limit={275}
                            name="bio"
                            placeholder="Write a short introduction."
                            rows={6}
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={12}>
                        <Select
                            control={control}
                            isMultiple={false}
                            label={t('country')}
                            name="country"
                            options={countriesOptions}
                            showFlag
                            withOptionsSearch
                        />
                    </Col>
                </Row>
            </Box>
            {
                isDirty && !isSubmitSuccessful && <FormActions handleCancel={handleCancel} isSubmitting={isSubmitting} />
            }
        </form>
    );
}

export default Form;
