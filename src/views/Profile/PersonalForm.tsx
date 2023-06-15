import { Box, Col, Row } from '@impact-market/ui';
import { countriesOptions } from '../../utils/countries';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from 'react-hook-form';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from 'react';
import Select from '../../components/Select';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const schema = yup.object().shape({
    age: yup
        .number()
        .positive()
        .integer()
        .min(1)
        .max(150)
        .nullable(true)
        .transform((_, val) => (val === '' ? null : Number(val))),
    firstName: yup.string().max(30),
    lastName: yup.string().max(30)
});

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

    const {
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            age: auth?.user?.age || '',
            bio: auth?.user?.bio || '',
            country: auth?.user?.country || undefined,
            firstName: auth?.user?.firstName || '',
            gender: auth?.user?.gender || '',
            lastName: auth?.user?.lastName || ''
        },
        resolver: useYupValidationResolver(schema)
    });
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({
        control
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(getValues());
        }
    }, [isSubmitSuccessful]);

    const handleCancel = (e: any) => {
        e.preventDefault();
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Row>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        <Input
                            control={control}
                            hint={
                                errors?.firstName
                                    ? t(
<<<<<<< HEAD
                                        // @ts-ignore
                                          errors?.firstName?.message?.key
                                      )?.replace(
                                          '{{ value }}',
                                        // @ts-ignore
=======
                                          errors?.firstName?.message?.key
                                      )?.replace(
                                          '{{ value }}',
>>>>>>> 18835b4 (Final touches rejected view)
                                          errors?.firstName?.message?.value
                                      )
                                    : ''
                            }
                            label={t('firstName')}
                            name="firstName"
                            withError={!!errors?.firstName}
                        />
                    </Col>
                    <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0.75 }}>
                        <Input
                            control={control}
                            hint={
                                errors?.lastName
                                    ? t(
<<<<<<< HEAD
                                        // @ts-ignore
                                          errors?.lastName?.message?.key
                                      )?.replace(
                                          '{{ value }}',
                                        // @ts-ignore
=======
                                          errors?.lastName?.message?.key
                                      )?.replace(
                                          '{{ value }}',
>>>>>>> 18835b4 (Final touches rejected view)
                                          errors?.lastName?.message?.value
                                      )
                                    : ''
                            }
                            label={t('lastName')}
                            name="lastName"
                            withError={!!errors?.lastName}
                        />
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 1, xs: 0.75 }}>
                        <Input
                            control={control}
                            hint={
                                errors?.age
<<<<<<< HEAD
                                    // @ts-ignore
                                    ? t(errors?.age?.message?.key)?.replace(
                                          '{{ value }}',
                                          // @ts-ignore
=======
                                    ? t(errors?.age?.message?.key)?.replace(
                                          '{{ value }}',
>>>>>>> 18835b4 (Final touches rejected view)
                                          errors?.age?.message?.value
                                      )
                                    : ''
                            }
                            label={t('age')}
                            name="age"
                            onKeyDown={(e: any) =>
                                (e.key === 'e' || e.key === '-') &&
                                e.preventDefault()
                            }
                            type="number"
                            withError={!!errors?.age}
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
            {isDirty && !isSubmitSuccessful && (
                <FormActions
                    handleCancel={handleCancel}
                    isSubmitting={isSubmitting}
                />
            )}
        </form>
    );
};

export default Form;
