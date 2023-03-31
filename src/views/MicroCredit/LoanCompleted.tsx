import { Box, Display, Text } from '@impact-market/ui';
import Image from '../../libs/Prismic/components/Image';
import LoanOverview from './LoanOverview';

const LoanCompleted = (props: any) => {
    const { data, overviewData } = props;
    /* title, description, from prismic */
    const { cardImage } = data;  

    return (
        <Box flex fDirection={{ sm: 'row', xs: 'column' }}>
            <Box style={{ flexBasis: '50%' }} center order={{ sm: 0, xs: 1 }}>
                <Display g800 medium>
                    {/* {title} */}
                    {'Congratulations!'}
                </Display>
                <Text small mt={0.5}>
                    {/* {description} */}
                    {'You have successfully paid off your entire loan. 🥳'}
                </Text>

                <LoanOverview overviewData={overviewData} />
            </Box>
            <Box
                style={{ flexBasis: '50%' }}
                ml={{ sm: '4rem', xs: 0 }}
                mb={{ sm: 0, xs: '1rem' }}
                fLayout="center"
                flex
                order={{ sm: 1, xs: 0 }}
            >
                <Image {...cardImage} radius={0.5} w="100%" mb={1} />
            </Box>
        </Box>
    );
};

export default LoanCompleted;
