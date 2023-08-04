import { Box, Button, Display, Text } from '@impact-market/ui';
import { styled } from 'styled-components';
import { useRouter } from 'next/router';
import Image from '../../libs/Prismic/components/Image';
import RichText from '../../libs/Prismic/components/RichText';

const RichTextStyled = styled(RichText)`
    ol {
        list-style: decimal inside;
        margin-top: 1rem;
    }

    p {
        margin-top: 1rem;

        &:first-child {
            margin-top: 0;
        }
    }

    a {
        color: inherit;
        text-decoration: none;
        font-weight: 600;
    }
`;

const LoanInReview = (props: any) => {
    const router = useRouter();
    const { data, loanId } = props;
    const {
        inreviewLoanTitle,
        inreviewLoanDescription,
        inreviewLoanDetails,
        inreviewLoanImage,
        inreviewLoanButton
    } = data;

    return (
        <Box
            flex
            fDirection={{ sm: 'row', xs: 'column' }}
            padding={{ sm: '4rem', xs: '1rem' }}
        >
            <Box style={{ flexBasis: '50%' }} order={{ sm: 0, xs: 1 }}>
                <Display g800 semibold>
                    {inreviewLoanTitle}
                </Display>
                <RichTextStyled
                    content={inreviewLoanDescription}
                    g500
                    mt={1.5}
                />
                <Button
                    onClick={() => router.push(`/microcredit/form/${loanId}`)}
                    mt={1.5}
                >
                    <Text small>{inreviewLoanButton}</Text>
                </Button>
                <RichTextStyled content={inreviewLoanDetails} mt={1.5} g500 />
            </Box>
            <Box
                style={{ flexBasis: '50%' }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <Image {...inreviewLoanImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default LoanInReview;
