import React from 'react';
import _ from 'lodash';

import { useSelector } from 'react-redux';

import {
    Box,
    Button,
    Card,
    Text,
    TextLink,
    openModal
} from '@impact-market/ui';

import { currencyFormat } from '../utils/currencies';
import { formatAddress } from '../utils/formatAddress';
import { formatPercentage } from '../utils/percentages';
import { selectCurrentUser } from '../state/slices/auth';
import ProgressBar from './ProgressBar';
import config from '../../config';

import String from '../libs/Prismic/components/String';
import useTranslations from '../libs/Prismic/hooks/useTranslations';



interface DonateCardProps {
    raised: number;
    goal: number;
    contractAddress: string;
    beneficiariesNumber: number;
    backers: number;
}

// TODO:
// - Handle missing translations
// - Add action to contribute button

const DonateCard: React.FC<DonateCardProps> = (props) => {
    const {
        raised,
        goal,
        contractAddress,
        beneficiariesNumber,
        backers
    } = props;
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
        <Card padding={1.4} show={{sm: 'block', xs: 'none'}}>
            <Box fLayout="center" flex>
                <Text center g900 maxW={14} medium semibold>
                    Your contribution will help {beneficiariesNumber}{' '}
                    beneficiaries.
                </Text>
            </Box>
            <Box mt={1.5}>
                <Button
                    h={3.8}
                    onClick={() => openModal('contribute')}
                    w="100%"
                >
                    <Text large medium>
                        <String id="contribute" />
                    </Text>
                </Button>
            </Box>
            <Box fLayout="between" flex mt={1}>
                <Box left>
                    <Text center g500 mt={1} small>
                        {`${_.upperFirst(t('raisedFrom'))} ${backers} Backers`}
                    </Text>
                </Box>
                <Box right>
                    <Text center g500 mt={1} small>
                        <String id="goal" />
                    </Text>
                </Box>
            </Box>
            <Box fLayout="between" flex>
                <Box left>
                    <Text g900 semibold small>
                        {currencyFormat(raised, localeCurrency)} (
                        {formatPercentage(quotient)})
                    </Text>
                </Box>
                <Box right>
                    <Text g900 semibold small>
                        {currencyFormat(goal, localeCurrency)}
                    </Text>
                </Box>
            </Box>
            <Box mt={0.8}>
                <ProgressBar
                    progress={quotient * 100}
                    state={{ info: false }}
                />
            </Box>
            <Text center g500 mt={1} small>
                Explore the community Contract
            </Text>
            <Box center>
                <TextLink
                    large
                    onClick={() =>
                        window.open(`${config.explorerUrl}${contractAddress}`)
                    }
                    p600
                    semibold
                >
                    {formatAddress(contractAddress, [6, 5])}
                </TextLink>
            </Box>
        </Card>
    );
};

export default DonateCard;
