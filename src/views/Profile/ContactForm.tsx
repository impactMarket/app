import { Box } from '@impact-market/ui';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import FormActions from './FormActions';
import Input from '../../components/Input';
import React, { useEffect } from "react";
import RichText from '../../libs/Prismic/components/RichText';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { contactTooltip } = extractFromView('formSections') as any;

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            email: auth?.user?.email || '',
            phone: auth?.user?.phone || ''
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
                <Box mb={1.5}>
                    <Input 
                        control={control}
                        label={t('email')}
                        name="email"
                    />
                </Box>
                { /* TODO: acabar campo de telefone (com number masking talvez e país como está no design) */ }
                <Box mb={1.5}>
                    <Input 
                        control={control}
                        label={t('phoneNumber')}
                        name="phone"
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
