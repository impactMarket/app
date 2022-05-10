/* eslint-disable sort-keys */
import { Box, Col, Row, toast } from '@impact-market/ui';
import { countriesOptions } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from "react";
import Select from '../../components/Select';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();
    const { extractFromView } = usePrismicData();
    const { introduction } = extractFromView('formSections') as any;

    const genders = [
        { label: t('male'), value: 'm' },
        { label: t('female'), value: 'f' },
        { label: t('other'), value: 'o' }
    ];

    const { handleSubmit, reset, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            age: auth?.user?.age || undefined,
            bio: auth?.user?.bio || '',
            country: auth?.user?.country || '',
            firstName: auth?.user?.firstName || '',
            gender: auth?.user?.gender || '',
            lastName: auth?.user?.lastName || ''
        }
    });
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset(getValues());
        }
    }, [isSubmitSuccessful]);

    useEffect(() => {
        if(errors?.firstName || errors?.lastName || errors?.country) {
            // TODO: add text to Prismic
            toast.error('Please fill in all required fields!');
        }
    }, [errors]);

    const handleCancel = (e: any) => {
        e.preventDefault();
        reset();
    } 

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Row>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        { /* TODO: add text to Prismic */ }
                        <Input 
                            control={control}
                            hint={errors?.firstName ? 'This field is required' : ''}
                            label={t('firstName')}
                            name="firstName"
                            rules={{ required: true }}
                            withError={errors?.firstName}
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        { /* TODO: add text to Prismic */ }
                        <Input 
                            control={control}
                            hint={errors?.lastName ? 'This field is required' : ''}
                            label={t('lastName')}
                            name="lastName"
                            rules={{ required: true }}
                            withError={errors?.lastName}
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
                        <Input 
                            control={control}
                            label={t('bio')}
                            limit={275}
                            name="bio"
                            placeholder={introduction}
                            rows={6}
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={12}>
                        { /* TODO: add text to Prismic */ } 
                        <Select
                            control={control}
                            hint={errors?.country ? 'This field is required' : ''}
                            isMultiple={false}
                            label={t('country')}
                            name="country"
                            options={countriesOptions}
                            rules={{ required: true }}
                            showFlag
                            withError={errors?.country}
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
