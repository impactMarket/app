export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals', '/communities', '/communities/[id]', '/notifications', '/messages', '/manager/communities/add', '/learn-and-earn', '/learn-and-earn/[level]'];

export const privateRoutes: Routes = ['/profile', '/settings', '/mycommunity', '/learn-and-earn/[level]/[lesson]'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary'];

export const managerRoutes: Routes = ['/manager', '/manager/beneficiaries', '/manager/beneficiaries/[id]', '/manager/managers'];

export const ambassadorRoutes: Routes = ['/requests', '/ambassador', '/ambassador/reports', '/communities/edit/[id]', '/manager/beneficiaries'];

export const councilMemberRoutes: Routes = ['/communities/edit/[id]'];
