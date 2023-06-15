/* eslint-disable react-hooks/rules-of-hooks */
import { PutPostUser } from '../api/user';
import { selectCurrentUser } from '../state/slices/auth';
import { useSelector } from 'react-redux';
import useWallet from '../hooks/useWallet';

export const userAmbassador = 'ambassador';
export const userDemo = 'demo';
export const userDonor = 'donor';
export const userManager = 'manager';
export const userBeneficiary = 'beneficiary';
export const userCouncilMember = 'councilMember';
export const userLoanManager = 'loanManager';

export const getUserTypes = (user: PutPostUser) => {
    const types = [userDonor];

    if (user?.beneficiary) types.push(userBeneficiary);
    if (user?.manager) types.push(userManager);
    if (user?.councilMember) types.push(userCouncilMember);
    if (user?.ambassador) types.push(userAmbassador);
    if (user?.loanManager) types.push(userLoanManager);

    return types;
};

export const getUserName = (user: PutPostUser) => {
    const firstName = user?.firstName?.split(' ')[0] || '';
    const lastName = user?.lastName?.split(' ').pop() || '';

    return firstName || firstName ? `${firstName} ${lastName}` : '';
};

export const checkUserPermission = (types: string[]) => {
    const auth = useSelector(selectCurrentUser);
    const { address } = useWallet();

    if (
        address &&
        auth?.user &&
        auth?.type?.some((value: string) => types.includes(value))
    ) {
        return true;
    }

    return false;
};
