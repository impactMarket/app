import { Box, Button, Col, Row } from '@impact-market/ui';
import { currenciesOptions } from '../../utils/currencies';
import { languagesOptions } from '../../utils/languages';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React, { useEffect } from "react";
import Select from '../../components/Select';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            currency: auth?.user?.currency,
            language: auth?.user?.language
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
            <Box mb={1.5}>
                <Select 
                    control={control}
                    isMultiple={false}
                    label={t('currency')}
                    name="currency" 
                    options={currenciesOptions}
                    withOptionsSearch
                />
            </Box>
            { /* TODO: carregar apenas os 4 idiomas disponíveis do Prismic (português, inglês, espanhol e francês) */ }
            <Box>
                <Select 
                    control={control}
                    isMultiple={false}
                    label={t('language')}
                    name="language"
                    options={languagesOptions}
                    withOptionsSearch
                />
            </Box>
            {
                isDirty && !isSubmitSuccessful &&
                <Box mt={0.875}>
                    <Row >
                        <Col colSize={12} right>
                            <Button default disabled={isSubmitting} gray mr={0.75} onClick={(e: any) => handleCancel(e)}>
                                <String id="cancel" />
                            </Button>
                            <Button default isLoading={isSubmitting} type="submit">
                                <String id="saveChanges" />
                            </Button>
                        </Col>
                    </Row>
                </Box>
            }
        </form>
    );
}

export default Form;
