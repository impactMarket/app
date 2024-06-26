import config from '../../config';

export type Routes = string[];

// Feature flag for learn and earn, remove once fully deployed
const laePublicRoutes =
    config.enableLearnEarn === 'true'
        ? ['/learn-and-earn', '/learn-and-earn/[level]']
        : [];

const laePrivateRoutes =
    config.enableLearnEarn === 'true'
        ? ['/learn-and-earn/[level]/[lesson]']
        : [];

export const publicRoutes: Routes = [
    '/',
    '/support',
    '/stories',
    '/proposals',
    '/communities',
    '/communities/[id]',
    '/notifications',
    '/messages',
    '/manager/communities/add',
    ...laePublicRoutes,
    '/microcredit/application',
    '/microcredit/apply',
    '/microcredit/form/[id]',
    '/microcredit',
    '/verify-email'
];

export const privateRoutes: Routes = ['/profile', '/settings', '/mycommunity'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary', ...laePrivateRoutes];

export const managerRoutes: Routes = [
    '/manager',
    '/manager/beneficiaries',
    '/manager/managers',
    '/user/[id]',
    '/beneficiaries',
    ...laePrivateRoutes
];

export const ambassadorRoutes: Routes = [
    '/requests',
    '/ambassador',
    '/ambassador/reports',
    '/communities/edit/[id]',
    '/manager/beneficiaries',
    '/beneficiaries'
];

export const councilMemberRoutes: Routes = ['/communities/edit/[id]'];

export const borrowerRoutes: Routes = ['/microcredit'];

export const loanManagerRoutes: Routes = ['/microcredit-manager', '/user/[id]'];
