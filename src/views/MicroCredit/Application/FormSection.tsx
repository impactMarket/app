import { Box, Card, Col, Row } from '@impact-market/ui';
import { mq } from 'styled-gen';
import FullWidthField from './FullWidthField';
import MobileBankerSelector from './MobileBankerSelector';
import RichText from '../../../libs/Prismic/components/RichText';
import styled, { css } from 'styled-components';

const Section = styled(Row)`
    ${mq.phone(css`
        margin-bottom: 3rem;

        .section-info {
            margin-bottom: 1rem;
        }
    `)};
`;

const DoubleInputWrapper = styled(Row)`
    ${mq.phone(css`
        flex-direction: column;

        > .column {
            flex-basis: 100% !important;
            width: 100%;
        }
    `)};
`;

export interface FormSectionProps {
    address: string;
    applicationId?: string;
    items: Array<any>;
    fieldType: string;
    primary: any;
    readOnly: boolean;
    sectionId: string;
    setLoanManagerId: (managerId: number) => void;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

const FormSection = (props: FormSectionProps) => {
    const {
        address,
        applicationId,
        items,
        fieldType,
        primary,
        readOnly,
        sectionId,
        setLoanManagerId,
        updateFormData,
        getElement
    } = props;
    let counter = 0;
    const title = primary?.title;
    const description = primary?.description;

    return (
        <Section mb="1.3rem">
            <Col
                className="section-info"
                colSize={{ sm: 4, xs: 12 }}
                pb={1.25}
                pt={{ sm: 1.25, xs: 0 }}
            >
                <RichText content={title} g700 medium small semibold />
                <RichText content={description} g500 regular small />
            </Col>
            <Col
                colSize={{ sm: 8, xs: 12 }}
                pb="1.25rem"
                pl="0"
                pt={{ sm: 1.25, xs: 0 }}
            >
                <Card padding="0">
                    {items.map((item, idx) => {
                        if (fieldType === 'mobile_banker_selector') {
                            return (
                                <MobileBankerSelector
                                    item={primary}
                                    fieldType={fieldType}
                                    idx={idx}
                                    readOnly={readOnly}
                                    sectionId={sectionId}
                                    setLoanManagerId={setLoanManagerId}
                                    updateFormData={updateFormData}
                                    getElement={getElement}
                                />
                            );
                        }

                        if (fieldType === 'full_width_form_field') {
                            return (
                                <FullWidthField
                                    address={address}
                                    applicationId={applicationId}
                                    item={item}
                                    fieldType={fieldType}
                                    idx={idx}
                                    readOnly={readOnly}
                                    sectionId={sectionId}
                                    updateFormData={updateFormData}
                                    getElement={getElement}
                                />
                            );
                        }

                        if (fieldType === 'double_input') {
                            const item1 = {
                                disclaimer: item.disclaimer1,
                                options: item.options1,
                                placeholder: item.placeholder1,
                                question: item.question1,
                                type: item.type1
                            };
                            const item2 = {
                                disclaimer: item.disclaimer2,
                                options: item.options2,
                                placeholder: item.placeholder2,
                                question: item.question2,
                                type: item.type2
                            };

                            return (
                                <DoubleInputWrapper
                                    padding=".5rem 0 0"
                                    pb={
                                        items.length - 1 === idx ? '1.5rem' : ''
                                    }
                                    flex
                                    fLayout="start between"
                                >
                                    {[1, 2].map((id: number) => (
                                        <Box
                                            className="column"
                                            style={{ flexBasis: '50%' }}
                                        >
                                            <FullWidthField
                                                applicationId={applicationId}
                                                item={id === 1 ? item1 : item2}
                                                fieldType={fieldType}
                                                idx={counter++}
                                                readOnly={readOnly}
                                                sectionId={sectionId}
                                                updateFormData={updateFormData}
                                                getElement={getElement}
                                            />
                                        </Box>
                                    ))}
                                </DoubleInputWrapper>
                            );
                        }
                    })}
                </Card>
            </Col>
        </Section>
    );
};

export default FormSection;
