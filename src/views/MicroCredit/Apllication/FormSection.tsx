import { Box, Card, Col, Row } from '@impact-market/ui';
import FullWidthField from './FullWidthField';
import RichText from '../../../libs/Prismic/components/RichText';

export interface FormSectionProps {
    items: Array<any>;
    fieldType: string;
    title: any;
    description: any;
    sectionId: string;
    updateFormData: (rowKey: string, columnKey: number, value: any) => void;
    getElement: (rowKey: any, columnKey: number) => any;
}

const FormSection = (props: FormSectionProps) => {
    const {
        items,
        title,
        description,
        fieldType,
        sectionId,
        updateFormData,
        getElement
    } = props;
    let counter = 0;

    return (
        <Row mb="1.3rem">
            <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <RichText content={title} g700 medium small semibold />
                <RichText content={description} g500 regular small />
            </Col>
            <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Card padding="0">
                    {items.map((item, idx) => {
                        if (fieldType === 'full_width_form_field') {
                            return (
                                <FullWidthField
                                    item={item}
                                    fieldType={fieldType}
                                    idx={idx}
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
                                type: item.type1,
                            };
                            const item2 = {
                                disclaimer: item.disclaimer2,
                                options: item.options2,
                                placeholder: item.placeholder2,
                                question: item.question2,
                                type: item.type2,
                            };

                            return (
                                <Box
                                    padding="1.5rem 0 0"
                                    pb={
                                        items.length - 1 === idx ? '1.5rem' : ''
                                    }
                                    flex
                                    fLayout="start between"
                                >
                                    <Box style={{ flexBasis: '48%' }}>
                                        <FullWidthField
                                            item={item1}
                                            fieldType={fieldType}
                                            idx={counter++}
                                            sectionId={sectionId}
                                            updateFormData={updateFormData}
                                            getElement={getElement}
                                        />
                                    </Box>
                                    <Box style={{ flexBasis: '48%' }}>
                                        <FullWidthField
                                            item={item2}
                                            fieldType={fieldType}
                                            idx={counter++}
                                            sectionId={sectionId}
                                            updateFormData={updateFormData}
                                            getElement={getElement}
                                        />
                                    </Box>
                                </Box>
                            );
                        }
                    })}
                </Card>
            </Col>
        </Row>
    );
};

export default FormSection;
