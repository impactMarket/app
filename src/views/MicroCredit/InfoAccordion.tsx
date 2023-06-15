import { Accordion, AccordionItem, Text } from '@impact-market/ui';

const InfoAccordion = (props: any) => {
    const { data } = props;
    const {
        infoAccordionWhat,
        infoAccordionAnsWhat,
        infoAccordionWho,
        infoAccordionAnsWho,
        infoAccordionAfter,
        infoAccordionAnsAfter
    } = data;

    return (
        <Accordion>
            <AccordionItem title={infoAccordionWhat}>
                <Text>{infoAccordionAnsWhat}</Text>
            </AccordionItem>
            <AccordionItem title={infoAccordionWho}>
                <Text>{infoAccordionAnsWho}</Text>
            </AccordionItem>
            <AccordionItem title={infoAccordionAfter}>
                <Text>{infoAccordionAnsAfter}</Text>
            </AccordionItem>
        </Accordion>
    );
};

export default InfoAccordion;
