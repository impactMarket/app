import { Box, Button, Card, Text } from '@impact-market/ui';
import { currencyFormat } from '../utils/currencies';
import { formatAddress } from '../utils/formatAddress';
import { formatPercentage } from '../utils/percentages';
import { mq } from 'styled-gen';
import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import ProgressBar from './ProgressBar';
import React from 'react';
import styled, { css } from 'styled-components';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const DonateCardWrapper = styled(Card)`
    ${mq.phone(css`
        display: none;
    `)};
`;

interface DonateCardProps {
    raised: number;
    goal: number;
    contractAddress: string;
    beneficiariesNumber: number;
    backers: number;
}

// TODO: Handle missing translations
const DonateCard: React.FC<DonateCardProps> = (props) => {
    const { raised, goal, contractAddress, beneficiariesNumber, backers } = props;
    const { t } = useTranslations();
    const quotient = raised / goal || 0;
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        maximumFractionDigits: 0,
        style: 'currency'
    });

    return (
        <DonateCardWrapper padding={1.4}>
            <Box fLayout="center" flex>
                <Text center g900 maxW={14} medium semibold>
                    Your contribution will help {beneficiariesNumber} beneficiaries.
                </Text>
            </Box>
            <Box mt={1.5}>
                <Button h={3.8} w="100%">
                    <Text large medium>
                        {t('contribute')}
                    </Text>
                </Button>
            </Box>
            <Box fLayout="between" flex mt={1}>
                <Box left>
                    <Text center g500 mt={1} small >
                        {`${t('raisedFrom')} ${backers} Backers`}
                    </Text>
                </Box>
                <Box right>
                    <Text center g500 mt={1} small >
                        {t('goal')}
                    </Text>
                </Box>
            </Box>
            <Box fLayout="between" flex>
                <Box left>
                    <Text g900 semibold small>
                        {currencyFormat(raised, localeCurrency)} ({formatPercentage(quotient)})
                    </Text>
                </Box>
                <Box right>
                    <Text g900 semibold small>
                        {currencyFormat(goal, localeCurrency)}
                    </Text>
                </Box>
            </Box>
            <Box mt={0.8}>
                <ProgressBar progress={30} state={{ info: true }} />
            </Box>
            <Text center g500 mt={1} small >
                Explore the community Contract
            </Text>
            <Text center large p600 semibold >
                {formatAddress(contractAddress, [6, 5])}
            </Text>
        </DonateCardWrapper>
    );
};

export default DonateCard;
