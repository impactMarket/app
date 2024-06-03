import { Box, Display, Label, ViewContainer, colors } from '@impact-market/ui';
import { usePrismicData } from 'src/libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import RichText from 'src/libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import styled from 'styled-components';

const Description = styled(RichText)`
    a {
        color: #5a6fef;
        font-weight: 600;
        text-decoration: none;
    }
`;

const Heading = styled(Display)`
    color: ${colors.g700};
    font-size: 1.875rem;
    font-weight: 600;
    line-height: 2.375rem;
    margin-bottom: 1rem;
    text-align: center;

    @media (max-width: '576px') {
        font-size: 1.1rem;
        line-height: 28px;
    }
`;

const Pact = () => {
    const { view } = usePrismicData();
    const router = useRouter();

    return (
        <ViewContainer {...({} as any)} isLoading={false}>
            <Box as="a" onClick={() => router.back()}>
                <Label content={<String id="back" />} icon="arrowLeft" />
            </Box>
            <Box mt="1.5rem">
                <Heading style={{ textAlign: 'left' }}>
                    {view?.data?.howToPact}
                </Heading>
                <Box>
                    <Heading
                        style={{
                            fontSize: '16px',
                            marginBottom: 0,
                            textAlign: 'left'
                        }}
                    >
                        {view?.data?.stakePact}
                    </Heading>
                    <Description
                        content={view?.data?.stakePactDescription}
                        small
                        regular
                        // @ts-ignore
                        style={{ color: '#344054' }}
                    />
                    <Description
                        content={view?.data?.readyToStake}
                        small
                        regular
                        // @ts-ignore
                        style={{ color: '#344054', marginTop: '0.5rem' }}
                    />
                </Box>
            </Box>
        </ViewContainer>
    );
};

export default Pact;
