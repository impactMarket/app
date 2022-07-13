import { frequencyToText } from '@impact-market/utils/frequencyToText';
import { toNumber } from '@impact-market/utils/toNumber';
import { toToken } from '@impact-market/utils/toToken';
import config from '../../config';

interface Community {
    ambassadorAddress: string;
    requestByAddress: string;
    id: number;
    name: string;
    description: string;
}

interface Contract {
    claimAmount: string;
    maxClaim: string;
    baseInterval: string;
    incrementInterval: string;
}

const PROPOSAL_CONSTANTS = {
    dev: {
        maxTranche: 5,
        minTranche: 1
    },
    exponential: 25,
    maxBeneficiaries: 50,
    prod: {
        maxTranche: 5000,
        minTranche: 100
    }
};

const getTranches = () => {
    if (config.useTestNet) {
        return {
            maxTranche: PROPOSAL_CONSTANTS.dev.maxTranche,
            minTranche: PROPOSAL_CONSTANTS.dev.minTranche
        };
    }

    return {
        maxTranche: PROPOSAL_CONSTANTS.prod.maxTranche,
        minTranche: PROPOSAL_CONSTANTS.prod.minTranche
    };
};

const generateCommunityProposal = ( community: Community, contract: Contract ) => {
    const { ambassadorAddress, requestByAddress, id, name, description } = community;
    const { claimAmount, maxClaim, baseInterval, incrementInterval } = contract;
    const { minTranche, maxTranche } = getTranches();
    const { maxBeneficiaries, exponential } = PROPOSAL_CONSTANTS;

    return {
        ambassador: ambassadorAddress,
        baseInterval,
        claimAmount,
        decreaseStep: toToken(0.01),
        incrementInterval,
        managers: [requestByAddress],
        maxBeneficiaries,
        maxClaim,
        maxTranche: toToken(maxTranche, { EXPONENTIAL_AT: exponential }),
        minTranche: toToken(minTranche),
        proposalDescription: `
        ## Description:
        ${description}

        UBI Contract Parameters:
        Claim Amount: ${toNumber(claimAmount)}
        Max Claim: ${toNumber(maxClaim)}
        Base Interval: ${frequencyToText(+baseInterval)}
        Increment Interval: ${incrementInterval} minutes


        More details: ${config.baseUrl}/communities/${id}`,
        proposalTitle: `[New Community] ${name}`
    };
};

export default generateCommunityProposal;
