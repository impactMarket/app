import { Box, colors } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import RichText from '../../libs/Prismic/components/RichText';

const LoanRejected = (props: any) => {
    const { data } = props;
    const {
        rejectedLoanTitle,
        rejectedLoanDescription,
        rejectedLoanWhat,
        rejectedLoanErr,
        rejectedLoanRev,
        rejectedLoanQuest,
        rejectedLoanImage
    } = data;

    return (
        <Box fLayout="start" flex fDirection={{ sm: 'row', xs: 'column' }}>
            <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
                <Box
                    style={{ flexBasis: '60%' }}
                    center
                    order={{ sm: 0, xs: 1 }}
                >
                    <Image {...rejectedLoanImage} radius={0.5} w="95%" mb={1} />
                    <RichText content={rejectedLoanTitle} g800 medium />
                    <RichText
                        content={rejectedLoanDescription}
                        small
                        mt={0.5}
                        g500
                    />
                </Box>

                <Box
                    ml={{ sm: '2rem', xs: 0 }}
                    mb={{ sm: 0, xs: '1rem' }}
                    fLayout="start"
                    flex
                    fDirection={{ sm: 'column', xs: 'row' }}
                    padding={2}
                    borderRadius={0.5}
                    backgroundColor={colors.g100}
                    order={{ sm: 1, xs: 0 }}
                    style={{
                        flexBasis: '65%',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <Box>
                        <RichText
                            mb={{ sm: '0.2rem' }}
                            content={rejectedLoanWhat}
                            g900
                            small
                        />
                        <RichText content={rejectedLoanErr} g500 extrasmall />
                    </Box>

                    <RichText content={rejectedLoanRev} g500 extrasmall />

                    <RichText content={rejectedLoanQuest} g500 extrasmall />
                </Box>
            </Box>
        </Box>
    );
};

export default LoanRejected;
