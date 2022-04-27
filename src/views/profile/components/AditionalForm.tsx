import { Box } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import FormActions from './FormActions';
import Input from '../../../components/Input';
import React, { useEffect } from "react";

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { extractFromView } = usePrismicData();
    const { additionalInfoLabelChildren } = extractFromView('formSections') as any;

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            children: auth?.user?.children
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
                <Input 
                    control={control}
                    label={additionalInfoLabelChildren}
                    name="children"
                    wrapperProps={{
                        maxW: { sm: "50%", xs: "100%" }
                    }}
                />
            </Box>
            {
                isDirty && !isSubmitSuccessful && <FormActions handleCancel={handleCancel} isSubmitting={isSubmitting} />
            }
        </form>
    );
}

export default Form;
