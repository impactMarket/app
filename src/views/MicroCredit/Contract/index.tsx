import { Box, colors } from '@impact-market/ui';
import { dateHelpers } from '../../../helpers/dateHelpers';
import { useState } from 'react';
import ContractForm from './ContractForm';
import RichText from '../../../libs/Prismic/components/RichText';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const Contract = (props: any) => {
    const { data, claimLoan, loan, isLoading, setIsLoading } = props;
    const { contractContract, contractInstructions, contractSignBellow } = data;
    const { t } = useTranslations();
    const [userSignature, setUserSignature] = useState('');
    const [userId, setUserId] = useState('');

    const date = new Date();
    const currentDate = `${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;

    const monthlyInterestRate = (dailyInterest: number) => {
        return ((Math.pow(1 + dailyInterest / 100, 30) - 1) * 100).toFixed(2);
    };

    const interestRate = `${loan.dailyInterest}% ${t(
        'daily'
    )} / ${monthlyInterestRate(loan.dailyInterest)}% ${t('monthly')}`;

    // Update PDF with the user's loan data
    const updatedLoan = {
        amountBorrowed: `${loan.amountBorrowed} cUSD`,
        period: `${dateHelpers.secondsToMonth(loan.period)} ${t('months')}`,
        startDate: currentDate
    } as any;

    const mergedLoanData = {
        ...updatedLoan,
        borrowerId: userId ? ` ID ${userId} ` : ' ',
        borrowerName: userSignature || `<em><b>${contractSignBellow}</b></em>`,
        currentDate,
        interestRate
    };

    const updatedContract = contractContract.map((obj: any) => {
        if (obj.type === 'paragraph' && obj.text) {
            const updatedText = replaceVariables(obj.text);

            return { ...obj, text: updatedText };
        }

        return obj;
    });

    function replaceVariables(text: any) {
        const regex = /{{\s*([\w.]+)\s*}}/g;

        return text.replace(regex, (match: any, variable: string) => {
            return (mergedLoanData[variable.trim()] as any) || match;
        });
    }

    return (
        <Box flex fDirection={{ md: 'row', xs: 'column' }}>
            <Box
                center
                order={{ md: 0, xs: 1 }}
                padding={{ md: '4rem', xs: '1rem' }}
                style={{ flexBasis: '70%' }}
            >
                <Box tAlign="left">
                    <RichText content={updatedContract} g700 />
                </Box>
                <ContractForm
                    data={data}
                    loan={loan}
                    claimLoan={claimLoan}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    updatedContract={updatedContract}
                    setUserSignature={setUserSignature}
                    setUserId={setUserId}
                />
            </Box>
            <Box
                bgColor={colors.g100}
                order={{ md: 1, xs: 0 }}
                padding={{ md: '4rem', xs: '1rem' }}
                style={{ flexBasis: '30%' }}
            >
                <RichText content={contractInstructions} g500 />
            </Box>
        </Box>
    );
};

export default Contract;
