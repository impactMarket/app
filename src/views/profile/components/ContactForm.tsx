import { Box } from '@impact-market/ui';
import { Controller, useForm, useFormState } from "react-hook-form";
import { selectCurrentUser } from '../../../state/slices/auth';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import FormActions from './FormActions';
import Input from '../../../components/Input';
import React, { useEffect } from "react";
import RichText from '../../../libs/Prismic/components/RichText';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { contactTooltip } = extractFromView('formSections') as any;

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            email: auth?.user?.email,
            phone: auth?.user?.phone
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
    
    // TODO: ver como fica a parte do telefone
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Box mb={1.5}>
                    {/* <Controller
                        control={control}
                        name="email"
                        render={({ field }) => 
                            <Input 
                                label={t('email')}
                                { ...field } 
                            />
                        }
                    /> */}
                    <Input 
                        control={control}
                        name="email"
                        label={t('email')}
                    />
                </Box>
                <Box mb={1.5}>
                    { /* TODO: o disabled deveria ter outro estilo no UI */ }
                    {/* <Controller
                        control={control}
                        name="phone"
                        render={({ field }) => 
                            <Input 
                                disabled
                                label={t('phoneNumber')}
                                wrapperProps={{
                                    maxW: { sm: "50%", xs: "100%" }
                                }}
                                { ...field } 
                            />
                        }
                    /> */}
                    <Input 
                        control={control}
                        name="phone"
                        disabled
                        label={t('phoneNumber')}
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