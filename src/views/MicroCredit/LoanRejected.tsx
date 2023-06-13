import { Box, Display } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import RichText from '../../libs/Prismic/components/RichText';
import { FilledImageFieldImage } from '@prismicio/types';
import styled from 'styled-components';
import { colors } from '@impact-market/ui';

const LoanRejected = (props: any) => {
    const { data, overviewData } = props;
    const {
        completedLoanDescription,
    } = data;
    console.log('overviewData',data);

    const rejectedLoanImage: FilledImageFieldImage = {
        alt: "impactMarket - Loan Rejected",
        dimensions: { width: 322, height: 243 },
        url: "/rejectedLoan.png",
        copyright: null
    };

    

    return (
        <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
            <Box style={{ flexBasis: '60%'}} center order={{ sm: 0, xs: 1 }}>
                <Image {...rejectedLoanImage} radius={0.5} w="95%" mb={1} />
                <RichText content={"You microcredit application was rejected."} g800 medium/>
                <RichText content={completedLoanDescription} small mt={0.5} g500 /> 
            </Box>
            
            <Box
                style={{ flexBasis: '70%',backgroundColor: colors.g100, padding: '2rem', borderRadius: '0.5rem'   }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <RichText content={"What's next?"} g800 medium>
                    
                </RichText>
                
            </Box>
        </Box>
    );
};

export default LoanRejected;
