import { useSelector } from 'react-redux';

import { Grid } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';

import InfoCard from '../../components/InfoCard';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const InfoCards = ({ data, show }: any) => {
    const {
        beneficiaries = 0,
        claimAmount = 0,
        maxClaim = 0,
        incrementInterval = 0,
        baseInterval = 0,
        maxTranche = 0,
        minTranche = 0
    } = data;
    const auth = useSelector(selectCurrentUser);
    const user = auth?.user;
    const showAmbassadorMetrics =
        !!minTranche &&
        !!maxTranche &&
        user?.ambassador?.communities.some((x: any) => x === data.id);

    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });
    const { t } = useTranslations();
    const DAILY_BASE_INTERVAL = 17280;

    return (
        !!data && (
            <Grid
                colSpan={1}
                cols={{ sm: 4, xs: 2 }}
                mt={{ sm: 1.5, xs: 2 }}
                order={{ xs: 2 }}
                show={show}
            >
                {(!!beneficiaries || beneficiaries === 0) && (
                    <InfoCard
                        icon="users"
                        label="beneficiaries"
                        text={beneficiaries}
                    />
                )}
                {(!!claimAmount || claimAmount === 0) && (
                    <InfoCard
                        icon="heart"
                        label="claimPerBeneficiary"
                        text={`${currencyFormat(
                            claimAmount,
                            localeCurrency
                        )} / ${
                            baseInterval === DAILY_BASE_INTERVAL
                                ? t('day')
                                : t('week')
                        }`}
                    />
                )}
                {(!!maxClaim || maxClaim === 0) && (
                    <InfoCard
                        icon="check"
                        label="maxPerBeneficiary"
                        text={currencyFormat(maxClaim, localeCurrency)}
                        tooltip={currencyFormat(
                            data?.decreaseStep,
                            localeCurrency
                        )}
                    />
                )}
                {(!!incrementInterval || incrementInterval === 0) && (
                    <InfoCard
                        icon="clock"
                        label="timeIncrement"
                        text={`${parseFloat(
                            (incrementInterval / 12).toFixed(2)
                        )} ${t('minutes')}`}
                    />
                )}
                {(!!showAmbassadorMetrics || showAmbassadorMetrics === 0) && (
                    //  Only show tranche min/max to community's ambassador
                    <InfoCard
                        icon="coins"
                        label="trancheMinMax"
                        text={`${minTranche}/${maxTranche}`}
                    />
                )}
            </Grid>
        )
    );
};

export default InfoCards;
