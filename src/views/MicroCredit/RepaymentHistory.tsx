import { Box, Card, Divider, Text } from '@impact-market/ui';
import { dateHelpers } from '../../helpers/dateHelpers';
// import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const RepaymentHistory = () => {
    // const { t } = useTranslations();

    const repaymentData = [
        {
            amount: 10.0,
            timestamp: 1681506265
        },
        {
            amount: 10.0,
            timestamp: 1674827865
        },
        {
            amount: 20.5,
            timestamp: 1668506952
        }
    ];

    return (
        <Card>
            <Text g900 medium semibold mb="2.25rem">
                {'Loan Repayment History'}
            </Text>
            <Box>
                {repaymentData.map(({ amount, timestamp }, idx) => (
                    <>
                        <Box flex fLayout="between center">
                            <Box fGrow="1" fDirection="column" flex>
                                <Text g900 small medium>
                                    {`Repayment of Loan #${++idx}`}
                                </Text>
                                <Text small g600>
                                    {`Payed ${dateHelpers.ago(
                                        dateHelpers.unix(timestamp)
                                    )} · ${dateHelpers.unix(
                                        timestamp
                                    )} · ${new Date(
                                        timestamp * 1000
                                    ).toLocaleTimeString('en-US')}`}
                                </Text>
                            </Box>
                            <Text
                                bold
                                small
                                g700
                                fLayout="center"
                                flex
                                padding="0 1rem"
                            >
                                {`+ ${amount} cUSD`}
                            </Text>
                        </Box>
                        <Divider
                            mb={idx++ === repaymentData.length ? '0' : ''}
                        />
                    </>
                ))}
            </Box>
        </Card>
    );
};

export default RepaymentHistory;
