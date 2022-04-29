import { PutPostUser } from '../api/user';

export const userDemo = 'demo';
export const userDonor = 'donor';
export const userManager = 'manager';
export const userBeneficiary = 'beneficiary';

export const getUserTypes = (user: PutPostUser) => {
    const types = [userDonor];

    if(user?.beneficiary) types.push(userBeneficiary);
    if(user?.manager) types.push(userManager);

    return types;
};

export const getUserName = (user: PutPostUser) => {
    const firstName = user?.firstName?.split(' ')[0] || '';
    const lastName = user?.lastName?.split(' ').pop() || '';

    // TODO: verificar se é para colocar um nome por default
    return `${firstName} ${lastName}` || 'John Doe';
};
