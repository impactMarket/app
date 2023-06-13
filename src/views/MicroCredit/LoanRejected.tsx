import { Box, Display } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import RichText from '../../libs/Prismic/components/RichText';
import { FilledImageFieldImage } from '@prismicio/types';
import { colors } from '@impact-market/ui';

const LoanRejected = (props: any) => {
    const { data, overviewData } = props;
    const {
       
    } = data;
    console.log('overviewData',data);

    const rejectedLoanImage: FilledImageFieldImage = {
        alt: "impactMarket - Loan Rejected",
        dimensions: { width: 322, height: 243 },
        url: "/rejectedLoan.png",
        copyright: null
    };

    

    return (
            <Box    
                fLayout="start"
                flex
                fDirection={{ sm: 'row', xs: 'column' }}
            >
            <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
                <Box style={{ flexBasis: '60%'}} center order={{ sm: 0, xs: 1 }}>
                    <Image {...rejectedLoanImage} radius={0.5} w="95%" mb={1} />
                    <RichText content={"You microcredit application was rejected."} g800 medium/>
                    <RichText content={"We regret to inform you that your loan application has been denied 😢. We understand that this news may be disappointing, and we want to assure you that this decision was made after careful consideration of your application."} small mt={0.5} g500 /> 
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
                    <RichText content={"What's next?"} g900 extrasmall/>
                        
                    <RichText content={"If you believe there was an error in the evaluation of your application, or if you have additional information that you would like us to consider, please contact us at: <a href='mailto:microcredit@impactmarket.com'>microcredit@impactmarket.com</a>"} g500 extrasmall />
                    <br/>
                    <RichText content={"We encourage you to review your submission and financial information to identify any potential areas for improvement. You are welcome to reapply for a loan in the future."} g500 extrasmall />
                    <br/>
                    <RichText content={"We appreciate your interest in our microcredit and thank you for considering impactMarket for your financial needs. If you have any questions or would like further assistance, please feel free to reach out to us."} g500 extrasmall />
                </Box>
            </Box>
        </Box>
    );
};

export default LoanRejected;
