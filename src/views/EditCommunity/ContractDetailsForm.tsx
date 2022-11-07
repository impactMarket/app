import { toToken } from '@impact-market/utils/toToken';
import { toast } from '@impact-market/ui';
import { useForm, useFormState } from "react-hook-form";
import { useImpactMarketCouncil } from '@impact-market/utils/useImpactMarketCouncil';
import { useYupValidationResolver, yup } from '../../helpers/yup';
import ContractForm from '../AddCommunity/ContractForm';
import Message from '../../libs/Prismic/components/Message';
import React, { useEffect } from 'react';
import config from '../../../config';

const schema = yup.object().shape({
    baseInterval: yup.string().required(),
    claimAmount: yup.number().required().positive().min(0),
    incrementInterval: yup.number().required().positive().integer().min(0),
    maxClaim: yup.number().moreThan(yup.ref('claimAmount'), 'Max claim must be bigger than claim amount.').required()
});

export type ContractDetailsFormValues = {
    baseInterval: 'day' | 'week';
    claimAmount: string;
    incrementInterval: string;
    maxClaim: string;
};

const ContractDetailsForm = ({community, currency, rates, formData}: any) => {
    const { updateBeneficiaryParams } = useImpactMarketCouncil();

    const { handleSubmit, reset, control, getValues, formState: { errors } } = useForm<ContractDetailsFormValues>({
        defaultValues: formData,
        resolver: useYupValidationResolver(schema)
    });

    const { isSubmitting, isSubmitSuccessful } = useFormState({ control });

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset(getValues());
        }
    }, [isSubmitSuccessful]);
    

    const onSubmit = async (data: ContractDetailsFormValues) => {
        try {
            const res = await updateBeneficiaryParams({
                baseInterval: data.baseInterval === 'day' ? '17280' : '120960',
                claimAmount: toToken(data?.claimAmount),
                communityAddress: community?.contractAddress,
                decreaseStep: toToken(0.01),
                incrementInterval: (parseInt(data?.incrementInterval, 10) * 12).toString(),
                maxBeneficiaries: 0,
                maxClaim: toToken(data?.maxClaim),
                proposalDescription: `## Description:
                ${community?.description}
        
                UBI Contract Parameters:
                Claim Amount: ${data?.claimAmount}
                Max Claim: ${data?.maxClaim}
                Base Interval: ${data?.baseInterval}
                Increment Interval: ${data?.incrementInterval}
        
        
                More details: ${config.baseUrl}/communities/${community?.id}`,
                proposalTitle: `[Update Community] ${community?.name}`
            });

            if (res) {
                toast.success(<Message id="generatedSuccess" />);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(<Message id="errorOccurred" />);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ContractForm control={control} currency={currency} errors={errors} isLoading={isSubmitting} rates={rates} reset={() => reset(formData)} save />
        </form>
    );
};

export default ContractDetailsForm;
