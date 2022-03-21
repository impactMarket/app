export const USER_DEMO = 'demo';
export const USER_DONOR = 'donor';
export const USER_MANAGER = 'manager';
export const USER_BENEFICIARY = 'beneficiary';

export const getUserTypes = (user: any) => {
  const types = [USER_DONOR];

  if(user?.beneficiary) types.push(USER_BENEFICIARY);
  if(user?.manager) types.push(USER_MANAGER);

  return types;
};
