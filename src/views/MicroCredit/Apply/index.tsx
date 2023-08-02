import { Accordion, AccordionItem, Box, Button, Card, Display, ViewContainer } from '@impact-market/ui';
import { handleSignature } from '../../../helpers/handleSignature';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useSignatures } from '@impact-market/utils/useSignatures';
import Image from '../../../libs/Prismic/components/Image';
import LoanOverview from '../LoanOverview';
import RichText from '../../../libs/Prismic/components/RichText';
import styled from 'styled-components';
import useFilters from '../../../hooks/useFilters';

const AccordionComponent = styled(Accordion)`
    a {
        flex-wrap: wrap;
        max-width: 100%;
    }

    p {
        max-width: 100%;
    }
`;

const scrollIntoView = (isActive: boolean, el: HTMLElement) => {
    setTimeout(() => {
        if (!isActive) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, 300);
};

const MicroCredit = (props: any) => {
    const { data, view } = props;
    const {
        amountBorrowedLabel,
        amountBorrowedText,
        amountBorrowedTooltip,
        applyButton,
        applyContent,
        applyImage,
        applyTitle,
        faq,
        headingTitle,
        interestRateLabel,
        interestRateText,
        interestRateTooltip,
        loanDurationLabel,
        loanDurationText,
        loanDurationTooltip,
        successContent,
        successImage,
        successNextContent,
        successTitle,
        typeRateLabel,
        typeRateText,
        typeRateTooltip
    } = data[view].data;

    const { signature } = useSelector(selectCurrentUser);
    const { signMessage, signTypedData } = useSignatures();
    const { getByKey } = useFilters();
    const isSuccessful = getByKey('success') ?? false;
    const formId = getByKey('formId') ?? '';

    const router = useRouter();

    const loanData = [
        {
            label: amountBorrowedLabel,
            tooltip: amountBorrowedTooltip,
            value: amountBorrowedText
        },
        {
            label: loanDurationLabel,
            tooltip: loanDurationTooltip,
            value: loanDurationText
        },
        {
            label: interestRateLabel,
            tooltip: interestRateTooltip,
            value: interestRateText
        },
        {
            label: typeRateLabel,
            tooltip: typeRateTooltip,
            value: typeRateText
        }
    ];

    return (
        <ViewContainer {...({} as any)} isLoading={false}>
            <Display g900 medium>
                {headingTitle}
            </Display>
            <Box></Box>
            <Card mt="2rem" mb="2rem" padding={{ sm: '4rem', xs: '1rem' }}>
                {!isSuccessful && (
                    <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
                        <Box
                            style={{ flexBasis: '50%' }}
                            center
                            order={{ sm: 0, xs: 1 }}
                        >
                            <Display g800 medium>
                                {applyTitle}
                            </Display>
                            <RichText
                                content={applyContent}
                                small
                                mt={0.5}
                                g500
                            />

                            <LoanOverview overviewData={loanData} open />
                            <Box mt={1.5} flex fLayout="center">
                                <Button
                                    h={3.8}
                                    onClick={async () => {
                                        if (!signature) {
                                            await handleSignature(signMessage, signTypedData);
                                        }

                                        router.push('/microcredit/application');
                                    }}
                                    isLoading={false}
                                >
                                    <RichText
                                        large
                                        medium
                                        content={applyButton}
                                    />
                                </Button>
                            </Box>
                        </Box>
                        <Box
                            style={{ flexBasis: '50%' }}
                            ml={{ sm: '4rem', xs: 0 }}
                            mb={{ sm: 0, xs: '1rem' }}
                            fLayout="center"
                            flex
                            order={{ sm: 1, xs: 0 }}
                        >
                            <Image
                                {...applyImage}
                                radius={0.5}
                                w="100%"
                                mb={1}
                            />
                        </Box>
                    </Box>
                )}

                {isSuccessful && (
                    <Box
                        flex
                        fDirection={{ sm: 'row', xs: 'column' }}
                        padding="2rem"
                    >
                        <Box
                            style={{ flexBasis: '50%' }}
                            center
                            order={{ sm: 0, xs: 1 }}
                            mr="2.75rem"
                        >
                            <Box flex fLayout="center">
                                <Image
                                    {...successImage}
                                    style={{ maxWidth: '60%' }}
                                    w="100%"
                                    mb={1}
                                />
                            </Box>

                            <Display g800 medium>
                                {successTitle}
                            </Display>
                            <RichText
                                content={successContent}
                                small
                                mt={0.5}
                                g500
                                variables={{ formId }}
                            />
                        </Box>
                        <Box
                            style={{
                                backgroundColor: '#F9FAFB',
                                flexBasis: '50%'
                            }}
                            ml={{ sm: '2.75rem', xs: 0 }}
                            mb={{ sm: 0, xs: '1rem' }}
                            fLayout="center"
                            flex
                            order={{ sm: 1, xs: 0 }}
                        >
                            <Box padding="2rem">
                                <RichText
                                    content={successNextContent}
                                    small
                                    mt={0.5}
                                    g500
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </Card>
            {faq?.length > 0 && (
                <AccordionComponent mt={2}>
                    {faq?.map((faq: any, index: number) => (
                        <AccordionItem
                            key={index}
                            scrollIntoView={scrollIntoView}
                            title={faq.title}
                        >
                            <RichText content={faq.content} g500 small />
                        </AccordionItem>
                    ))}
                </AccordionComponent>
            )}
        </ViewContainer>
    );
};

export default MicroCredit;
