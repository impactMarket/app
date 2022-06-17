import { useSelector } from 'react-redux';

import { Grid } from '@impact-market/ui';
import { currencyFormat } from '../../utils/currencies';
import { selectCurrentUser } from '../../state/slices/auth';

import BeneficiaryCard from '../../components/BeneficiaryCard';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const Beneficiaries = ({ data }: any) => {
    const auth = useSelector(selectCurrentUser);
    const language = auth?.user?.language || 'en-US';
    const currency = auth?.user?.currency || 'USD';
    const localeCurrency = new Intl.NumberFormat(language, {
        currency,
        style: 'currency'
    });
    const { t } = useTranslations();
    const { user } = useSelector(selectCurrentUser);

    return (
        !!data && (
            <Grid colSpan={1} cols={{ sm: 4, xs: 2 }} mt={{ sm: 1.5, xs: 3 }}>
                {!!data?.beneficiaries && (
                    <BeneficiaryCard
                        icon="users"
                        label="beneficiaries"
                        text={data?.beneficiaries}
                    />
                )}
                {!!data?.claimAmount && (
                    <BeneficiaryCard
                        icon="heart"
                        label="claimPerBeneficiary"
                        text={`${currencyFormat(data?.claimAmount, localeCurrency)} / Day`}
                    />
                )}
                {!!data?.maxClaim && (
                    <BeneficiaryCard
                        icon="check"
                        label="maxPerBeneficiary"
                        text={currencyFormat(data?.maxClaim, localeCurrency)}
                    />
                )}
                {!!data?.incrementInterval && (
                    <BeneficiaryCard
                        icon="clock"
                        label="timeIncrement"
                        text={`${data?.incrementInterval} ${t('minutes')}`}
                    />
                )}
                {!!data?.minTranche && !!data?.maxTranche && (
                    //  Only show tranche min/max to community's ambassador
                    user.ambassador.communities.some((x: any) => x === data.id) &&
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
