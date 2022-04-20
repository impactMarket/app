import { Box, Button, Col, Divider, Row } from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import Input from '../../../components/Input';
import React, { useEffect } from "react";
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

type Inputs = {
    email: string,
    phone: string
};

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { contactTooltip } = extractFromView('formSections') as any;

    const { control, register, reset, handleSubmit } = useForm<Inputs>();
    const { isDirty, isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    // TODO: reset it's not working with the inputs from UI
    const handleCancel = () => {
        reset();
    }
    
    // TODO: ver como fica a parte do telefone
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1.5} pr={1.5}>
                <Box mb={1.5}>
                    <Input 
                        defaultValue={auth?.user?.email}
                        label={t('email')}
                        {...register("email")}
                    />
                </Box>
                <Box mb={1.5}>
                    <Input 
                        defaultValue={auth?.user?.phone}
                        disabled
                        label={t('phoneNumber')}
                        wrapperProps={{
                            maxW: { sm: "50%", xs: "100%" }
                        }}
                        {...register("phone")}
                    />
                </Box>
                <RichText content={contactTooltip} g500 regular small />
            </Box>
            {
                isDirty && !isSubmitSuccessful &&
                <>
                    <Divider/>
                    <Box pl={1.5} pr={1.5}>
                        <Row>
                            <Col colSize={12} right>
                                <Button default disabled={isSubmitting} gray mr={0.75} onClick={handleCancel}>
                                    <String id="cancel" />
                                </Button>
                                <Button default isLoading={isSubmitting} type="submit">
                                    <String id="saveChanges" />
                                </Button>
                            </Col>
                        </Row>
                    </Box>
                </>
            }
        </form>
    );
}

export default Form;