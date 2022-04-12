import { Box, Button, Col, Row, Text, colors } from '@impact-market/ui';
import { useForm, useFormState } from "react-hook-form";
import React, { useState } from "react";
import String from '../../../libs/Prismic/components/String';

const Form = ({ onSubmit }: any) => {
    const [showActions, toggleActions] = useState(false);

    const { control, register, handleSubmit } = useForm<any>();
    const { isSubmitting } = useFormState({ control });

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

    // TODO: colocar textos no prismic
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col colSize={1}>
                    <input {...register("action")} checked={showActions} onChange={onChange} type="checkbox"/>
                </Col>
                <Col colSize={11}>
                    <Text g700 medium small>Delete Account</Text>
                    <Text g500 medium small>I confirm that I want to delete my account and all my associated adat stored outside the Celo blockchain.</Text>
                </Col>
            </Row>
            {
                showActions &&
                <Box mt={1.5}>
                    <Row style={{ borderTop: `1px solid ${colors.g200}` }}>
                        <Col colSize={12} right>
                            <Button default disabled={isSubmitting} gray mr={0.75} onClick={handleCancel}>
                                <String id="cancel" />
                            </Button>
                            <Button default isLoading={isSubmitting} type="submit">
                                Confirm
                            </Button>
                        </Col>
                    </Row>
                </Box>
            }
        </form>
    );
}

export default Form;