import React from 'react';
import _ from 'lodash';

import {
    Box,
    Button,
    Card,
    Text,
    TextLink,
    openModal
} from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';

import { currencyFormat } from '../utils/currencies';
import { formatAddress } from '../utils/formatAddress';
import { formatPercentage } from '../utils/percentages';
import { selectCurrentUser } from '../state/slices/auth';
import ProgressBar from './ProgressBar';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import config from '../../config';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

interface DonateCardProps {
    raised: number;
    goal: number;
    contractAddress: string;
    beneficiariesNumber: number;
    backers: number;
}

// TODO:
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
    const { view } = usePrismicData();

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
        <Card padding={1.4} show={{ sm: 'block', xs: 'none' }}>
            <Box fLayout="center" flex>
                <RichText
                    center
                    content={view.data.messageBeneficiariesHelped}
                    g900
                    maxW={14}
                    medium
                    semibold
                    variables={{ beneficiariesNumber }}
                />
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
                    <Text g500 left mt={1} small>
                        {`${_.upperFirst(t('raisedFrom'))} ${backers} ${t('backers')}`}
                    </Text>
                </Box>
                <Box right>
                    <Text g500 mt={1} right small>
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
            <RichText
                center
                content={view.data.messageExploreContract}
                g500
                mt={1}
                small
            />
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
