import config from '../../config';

export type Routes = string[];

// Feature flag for learn and earn, remove once fully deployed
const laePublicRoutes = config.enableLearnEarn === 'true' ? ['/learn-and-earn', '/learn-and-earn/[level]'] : [];

const laePrivateRoutes = config.enableLearnEarn === 'true' ? ['/learn-and-earn/[level]/[lesson]'] : [];

export const publicRoutes: Routes = ['/', '/stories', '/proposals', '/communities', '/communities/[id]', '/notifications', '/messages', '/manager/communities/add', ...laePublicRoutes];

export const privateRoutes: Routes = ['/profile', '/settings', '/mycommunity', ...laePrivateRoutes];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary'];

export const managerRoutes: Routes = ['/manager', '/manager/beneficiaries', '/manager/beneficiaries/[id]', '/manager/managers'];

export const ambassadorRoutes: Routes = ['/requests', '/ambassador', '/ambassador/reports', '/communities/edit/[id]', '/manager/beneficiaries'];

export const councilMemberRoutes: Routes = ['/communities/edit/[id]'];
