import { Box } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import RichText from '../../libs/Prismic/components/RichText';
import { FilledImageFieldImage } from '@prismicio/types';
import { colors } from '@impact-market/ui';

const LoanRejected = (props: any) => {
    const { data } = props;
    const {
        rejectedLoanTitle,
        rejectedLoanDescription,
        rejectedLoanWhat,
        rejectedLoanErr,
        rejectedLoanRev,
        rejectedLoanQuest,
        rejectedLoanImage,
    } = data;
    

    // const rejectedLoanImage: FilledImageFieldImage = {
    //     alt: "impactMarket - Loan Rejected",
    //     dimensions: { width: 322, height: 243 },
    //     url: "/rejectedLoan.png",
    //     copyright: null
    // };

    

    return (
            <Box    
                fLayout="start"
                flex
                fDirection={{ sm: 'row', xs: 'column' }}
            >
            <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
                <Box style={{ flexBasis: '60%'}} center order={{ sm: 0, xs: 1 }}>
                    <Image {...rejectedLoanImage} radius={0.5} w="95%" mb={1} />
                    <RichText content={rejectedLoanTitle} g800 medium/>
                    <RichText content={rejectedLoanDescription} small mt={0.5} g500 /> 
                </Box>
                
                <Box
                    style={{ flexBasis: '70%',backgroundColor: colors.g100, padding: '2rem', borderRadius: '0.5rem'   }}
                    ml={{ sm: '2rem', xs: 0 }}
                    mb={{ sm: 0, xs: '1rem' }}
                    fLayout="start"
                    flex
                    fDirection={{ sm: 'column', xs: 'row'}}
                    order={{ sm: 1, xs: 0 }}
                >
                    <RichText content={rejectedLoanWhat} g900 extrasmall/>
                        
                    <RichText content={rejectedLoanErr} g500 extrasmall />
                    <br/>
                    <RichText content={rejectedLoanRev} g500 extrasmall />
                    <br/>
                    <RichText content={rejectedLoanQuest} g500 extrasmall />
                </Box>
            </Box>
        </Box>
    );
};

export default LoanRejected;
