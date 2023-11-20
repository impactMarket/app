import { Box, Display } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import Link from 'next/link';
import LoanOverview from './LoanOverview';
import RichText from '../../libs/Prismic/components/RichText';

const LoanCompleted = (props: any) => {
    const { data, overviewData } = props;
    const { completedLoanTitle, completedLoanDescription, completedLoanImage } =
        data;

    return (
        <Box
            flex
            fDirection={{ sm: 'row', xs: 'column' }}
            padding={{ sm: '4rem', xs: '1rem' }}
        >
            <Box style={{ flexBasis: '50%' }} center order={{ sm: 0, xs: 1 }}>
                <Display g800 medium>
                    {completedLoanTitle}
                </Display>
                <RichText
                    content={completedLoanDescription}
                    small
                    mt={0.5}
                    g500
                />

                <LoanOverview overviewData={overviewData} />
                <Link href="/microcredit/apply">Get a new loan</Link>
            </Box>
            <Box
                style={{ flexBasis: '50%' }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <Image {...completedLoanImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default LoanCompleted;
