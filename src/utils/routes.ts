import config from '../../config';

export type Routes = string[];

// Feature flag for learn and earn, remove once fully deployed
const laePublicRoutes =
    config.enableLearnEarn === 'true'
        ? ['/learn-and-earn', '/learn-and-earn/pact', '/learn-and-earn/[level]']
        : [];

const laePrivateRoutes =
    config.enableLearnEarn === 'true'
        ? ['/learn-and-earn/[level]/[lesson]', '/learn-and-earn/pact']
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
    '/learn-and-earn/pact'
];

export const privateRoutes: Routes = ['/profile', '/settings', '/mycommunity'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = [
    '/beneficiary',
    ...laePrivateRoutes,
    '/learn-and-earn/pact'
];

export const managerRoutes: Routes = [
    '/manager',
    '/manager/beneficiaries',
    '/manager/managers',
    '/user/[id]',
    '/beneficiaries',
    ...laePrivateRoutes,
    '/learn-and-earn/pact'
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
