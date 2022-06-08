import { Grid } from '@impact-market/ui';

import BeneficiaryCard from '../../components/BeneficiaryCard';

const Beneficiaries = ({ data }: any) =>
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
                    text={data?.claimAmount}
                />
            )}
            {!!data?.maxClaim && (
                <BeneficiaryCard
                    icon="check"
                    label="maxPerBeneficiary"
                    text={data?.maxClaim}
                />
            )}
            {!!data?.incrementInterval && (
                <BeneficiaryCard
                    icon="clock"
                    label="timeIncrement"
                    text={data?.incrementInterval}
                />
            )}
            {!!data?.minTranche && !!data?.maxTranche && (
                <BeneficiaryCard
                    icon="coins"
                    label="trancheMinMax"
                    text={`${data?.minTranche}/${data?.maxTranche}`}
                />
            )}
        </Grid>
    );

export default Beneficiaries;
