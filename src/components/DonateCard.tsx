import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import _ from 'lodash';

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
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';

import ProgressBar from './ProgressBar';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';
import config from '../../config';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

interface DonateCardProps {
    raised: number;
    goal: number;
    contractAddress: string;
    beneficiariesNumber: number;
    backers: number;
}

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
    const { update, getByKey } = useFilters();
    const { asPath } = useRouter();

    const quotient = raised / goal || 0;

    useEffect(() => {
        if (getByKey('contribute') !== undefined) {
            openModal('contribute', {
                contractAddress,
                value: getByKey('contribute')
            });
        }
    }, [asPath]);

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
                    onClick={() => update('contribute', 0)}
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
                        {`${_.upperFirst(t('raisedFrom'))} ${backers} ${t(
                            'backers'
                        )}`}
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
                        {currencyFormat(raised)} ({formatPercentage(quotient)})
                    </Text>
                </Box>
                <Box right>
                    <Text g900 semibold small>
                        {currencyFormat(goal)}
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
                        window.open(
                            config.explorerUrl?.replace(
                                '#USER#',
                                contractAddress
                            )
                        )
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
