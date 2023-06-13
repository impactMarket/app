import { Box, Card, Text } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import ProgressBar from '../../components/ProgressBar';
import React from 'react';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const ProgressBarComponent: React.FC<{
    communityEntity: any;
    currency: string;
    language: string;
}> = (props) => {
    const { communityEntity, currency, language } = props;
    const { t } = useTranslations();
    const goal =
        communityEntity?.beneficiaries * communityEntity?.maxClaim || 0;

    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });

    return (
        <Box mb={5} w="100%">
            <Card mt={1.5} padding={1.5} w="100%">
                <Box>
                    <ProgressBar
                        label={
                            <Text g500 small>{`${t('goal')}: ${currencyFormat(
                                goal,
                                localeCurrency
                            )}`}</Text>
                        }
                        progress={
                            goal > 0
                                ? (communityEntity?.contributed * 100) / goal
                                : 0
                        }
                        state={{ info: true }}
                        title={
                            <Text g900 semibold>{`${currencyFormat(
                                communityEntity?.contributed || 0,
                                localeCurrency
                            )} ${t('raisedFrom')} ${
                                communityEntity?.contributors || 0
                            } ${t('donors')}`}</Text>
                        }
                    />
                </Box>
                <Box mt={1.5}>
                    {/* TODO: add "<Label content={t('lowOnFunds')} icon="arrowDown" warning />" on label when Bernardo says */}
                    {/* TODO: below 20% the progress bar turns "red". Confirm this percentage */}
                    <ProgressBar
                        minValue={20}
                        progress={
                            goal > 0
                                ? (communityEntity?.estimatedFunds * 100) / goal
                                : 0
                        }
                        state={{ info: true }}
                        title={
                            <Text g900 semibold>{`${t(
                                'claimableFunds'
                            )} (${currencyFormat(
                                communityEntity?.estimatedFunds || 0,
                                localeCurrency
                            )})`}</Text>
                        }
                    />
                </Box>
            </Card>
        </Box>
    );
};

export default ProgressBarComponent;
