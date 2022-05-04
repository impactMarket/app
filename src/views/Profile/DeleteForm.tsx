import { Box, Text, Toggle } from '@impact-market/ui';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import FormActions from './FormActions';
import React, { useState } from "react";
import RichText from '../../libs/Prismic/components/RichText';

const Form = ({ onSubmit }: any) => {
    const [showActions, toggleActions] = useState(false);

    const { control, handleSubmit } = useForm<any>();
    const { isSubmitting } = useFormState({ control });

    const { extractFromView } = usePrismicData();
    const { deleteAccountTitle, deleteAccountTooltip } = extractFromView('formSections') as any;

    const handleCancel = () => {
        toggleActions(false);
    }

    const onChange = () => {
        if(showActions) {
            toggleActions(false);
        }
        else {
            toggleActions(true);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box fLayout="start" flex pl={1.5} pr={1.5}>
                <Box pr={0.5}>
                    <Toggle 
                        isActive={showActions}
                        onChange={onChange}
                    />
                </Box>
                <Box w="100%">
                    <Text g700 medium small>{deleteAccountTitle}</Text>
                    <RichText content={deleteAccountTooltip} g500 regular small />
                </Box>
            </Box>
            {
                showActions && <FormActions handleCancel={handleCancel} isSubmitting={isSubmitting} />
            }
        </form>
    );
}

export default Form;
