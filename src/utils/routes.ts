export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals', '/communities', '/communities/[id]', '/notifications', '/messages'];

export const privateRoutes: Routes = ['/profile', '/settings', '/manager/communities/add', '/manager/communities/[id]', '/mycommunity'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary'];

export const managerRoutes: Routes = ['/manager', '/manager/beneficiaries', '/manager/beneficiaries/[id]', '/manager/managers'];

export const ambassadorRoutes: Routes = ['/requests', '/ambassador', '/ambassador/reports'];
