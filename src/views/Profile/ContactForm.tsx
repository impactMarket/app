import { Box } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from "react";
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
    email: yup.string().matches(emailRegExp).email(),
    phone: yup.string().matches(phoneRegExp).nullable(true).transform((_, val) => val === '' ? null : val)
});

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { contactTooltip } = extractFromView('formSections') as any;

    const { handleSubmit, reset, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            email: auth?.user?.email || '',
            phone: auth?.user?.phone || ''
        },
        resolver: useYupValidationResolver(schema)
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
                <Box mb={1.5}>
                    <Input 
                        control={control}
                        hint={errors?.email ? t('errorEmail') : ''}
                        label={t('email')}
                        name="email"
                        withError={!!errors?.email}
                    />
                </Box>
                { /* TODO: finish phone field (like it is in the design) */ }
                { /* TODO: add text to Prismic */ }
                <Box mb={1.5}>
                    <Input 
                        control={control}
                        hint={errors?.phone ? 'Invalid phone number' : ''}
                        label={t('phoneNumber')}
                        name="phone"
                        withError={!!errors?.phone}
                        wrapperProps={{
                            maxW: { sm: "50%", xs: "100%" }
                        }} 
                    />
                </Box>
                <RichText content={contactTooltip} g500 regular small />
            </Box>
            {
                isDirty && !isSubmitSuccessful && <FormActions handleCancel={handleCancel} isSubmitting={isSubmitting} />
            }
        </form>
    );
}

export default Form;
