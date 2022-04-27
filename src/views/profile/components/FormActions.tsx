import { Box, Button, Col, Divider, Row } from '@impact-market/ui';
import React from "react";
import String from '../../../libs/Prismic/components/String';

const FormActions = ({ handleCancel, isSubmitting }: any) => {    
    return (
        <>
            <Divider/>
            <Box pl={1.5} pr={1.5}>
                <Row>
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
        </>
    );
}

export default FormActions;
