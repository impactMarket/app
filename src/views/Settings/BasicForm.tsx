import { Box, Button, Col, Row } from '@impact-market/ui';
import { currenciesOptions } from '../../utils/currencies';
import { languagesOptions } from '../../utils/languages';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Select from '../../components/Select';
import String from '../../libs/Prismic/components/String';
import langConfig from '../../../locales.config';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { handleSubmit, reset, control, getValues } = useForm({
        defaultValues: {
            currency: auth?.user?.currency,
            language: langConfig.find(
                ({ code, shortCode }) =>
                    auth?.user?.language === code ||
                    auth?.user?.language === shortCode
            )?.shortCode
        }
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
            <Box mb={1.5}>
                {/* TODO: missing country flags in Currencies select */}
                <Select
                    control={control}
                    isMultiple={false}
                    label={t('currency')}
                    name="currency"
                    options={currenciesOptions}
                    withOptionsSearch
                />
            </Box>
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
            {isDirty && !isSubmitSuccessful && (
                <Box mt={0.875}>
                    <Row>
                        <Col colSize={12} right>
                            <Button
                                default
                                disabled={isSubmitting}
                                gray
                                mr={0.75}
                                onClick={(e: any) => handleCancel(e)}
                            >
                                <String id="cancel" />
                            </Button>
                            <Button
                                default
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                                type="submit"
                            >
                                <String id="saveChanges" />
                            </Button>
                        </Col>
                    </Row>
                </Box>
            )}
        </form>
    );
};

export default Form;
