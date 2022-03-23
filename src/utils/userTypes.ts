export const userDemo = 'demo';
export const userDonor = 'donor';
export const userManager = 'manager';
export const userBeneficiary = 'beneficiary';

export const getUserTypes = (user: any) => {
  const types = [userDonor];

  if(user?.beneficiary) types.push(userBeneficiary);
  if(user?.manager) types.push(userManager);

  return types;
};
