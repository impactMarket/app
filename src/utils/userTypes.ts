export const userDemo = 'demo';
export const userDonor = 'donor';
export const userManager = 'manager';
export const userBeneficiary = 'beneficiary';

const usersWithPermissions: string[] = ['manager', 'beneficiary'];

export const getUserTypes = (user: any) => {
  const types = [userDonor];

  if(user?.beneficiary) types.push(userBeneficiary);
  if(user?.manager) types.push(userManager);

  return types;
};

export const checkUserPermission = (user: any, types: string[]) => {

    if(user !== null && types.some(value => usersWithPermissions.includes(value))) {
        return true
    }

    return false;
};
