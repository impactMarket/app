import { Box, Button, Col, Divider, Row, Text, Toggle } from '@impact-market/ui';
import { useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import React, { useState } from "react";
import RichText from '../../../libs/Prismic/components/RichText';
import String from '../../../libs/Prismic/components/String';

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
            <Box pl={1.5} pr={1.5}>
                <Row>
                    <Col colSize={1}>
                        <Toggle 
                            isActive={showActions}
                            onChange={onChange}
                        />
                    </Col>
                    <Col colSize={11}>
                        <Text g700 medium small>{deleteAccountTitle}</Text>
                        <RichText content={deleteAccountTooltip} g500 regular small />
                    </Col>
                </Row>
            </Box>
            {
                showActions &&
                <>
                    <Divider/>
                    <Box pl={1.5} pr={1.5}>
                        <Row>
                            <Col colSize={12} right>
                                <Button default disabled={isSubmitting} gray mr={0.75} onClick={handleCancel}>
                                    <String id="cancel" />
                                </Button>
                                <Button default isLoading={isSubmitting} type="submit">
                                    <String id="confirm" />
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