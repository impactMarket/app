import { Alert, Box, Card, Display, ViewContainer } from '@impact-market/ui';

import LoanRepayment from './LoanRepayment';

const MicroCredit = (props: any) => {
    const { data, view: viewName } = props;

    return (
        <ViewContainer isLoading={false}>
            <Alert
                warning
                icon="alertTriangle"
                mb={1.5}
                message={'This is a warning'}
            />
            <Display g900 medium>
                {'Micro-Credit'}
            </Display>
            <Box></Box>
            <Card mt="2rem" padding={{ sm: '4rem', xs: '1rem' }}>
                <LoanRepayment data={data[viewName].data} />
            </Card>
            <Box padding="2rem" />
        </ViewContainer>
    );
};

export default MicroCredit;
