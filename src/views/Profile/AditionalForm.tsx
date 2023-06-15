import { Box } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from 'react-hook-form';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from 'react';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const schema = yup.object().shape({
    children: yup
        .number()
        .positive()
        .integer()
        .min(0)
        .max(20)
        .nullable(true)
        .transform((_, val) => (val === '' ? null : Number(val)))
});

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { additionalInfoLabelChildren } = extractFromView(
        'formSections'
    ) as any;

    const {
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            children: auth?.user?.children || ''
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
                <Input
                    control={control}
                    hint={
                        errors?.children
                            ? t(errors?.children?.message?.key)?.replace(
                                  '{{ value }}',
                                  errors?.children?.message?.value
                              )
                            : ''
                    }
                    label={additionalInfoLabelChildren}
                    name="children"
                    onKeyDown={(e: any) =>
                        (e.key === 'e' || e.key === '-') && e.preventDefault()
                    }
                    type="number"
                    withError={!!errors?.children}
                    wrapperProps={{
                        maxW: { sm: '50%', xs: '100%' }
                    }}
                />
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
