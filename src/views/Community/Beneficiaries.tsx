import { useSelector } from 'react-redux';

import { Grid } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';

import BeneficiaryCard from '../../components/BeneficiaryCard';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Beneficiaries = ({ data, show }: any) => {
    const { beneficiaries, claimAmount, maxClaim, incrementInterval } = data;
    const auth = useSelector(selectCurrentUser);
    const user = auth?.user;
    const showAmbassadorMetrics = !!data?.minTranche && !!data?.maxTranche && user?.ambassador?.communities.some( (x: any) => x === data.id );
    
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });
    const { t } = useTranslations();

    return (
        !!data && (
            <Grid
                colSpan={1}
                cols={{ sm: 4, xs: 2 }}
                mt={{ sm: 1.5, xs: 2 }}
                order={{ xs: 2 }}
                show={show}
            >
                {!!beneficiaries && (
                    <BeneficiaryCard
                        icon="users"
                        label="beneficiaries"
                        text={data?.beneficiaries}
                    />
                )}
                {!!claimAmount && (
                    <BeneficiaryCard
                        icon="heart"
                        label="claimPerBeneficiary"
                        text={`${currencyFormat(
                            data?.claimAmount,
                            localeCurrency
                        )} / ${t('day')}`}
                    />
                )}
                {!!maxClaim && (
                    <BeneficiaryCard
                        icon="check"
                        label="maxPerBeneficiary"
                        text={currencyFormat(data?.maxClaim, localeCurrency)}
                    />
                )}
                {!!incrementInterval && (
                    <BeneficiaryCard
                        icon="clock"
                        label="timeIncrement"
                        text={`${data?.incrementInterval / 12} ${t('minutes')}`}
                    />
                )}
                {!!showAmbassadorMetrics && (
                        //  Only show tranche min/max to community's ambassador
                        <BeneficiaryCard
                            icon="coins"
                            label="trancheMinMax"
                            text={`${data?.minTranche}/${data?.maxTranche}`}
                        />
                    )}
            </Grid>
        )
    );
};

export default Beneficiaries;
