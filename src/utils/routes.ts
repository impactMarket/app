export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals', '/communities', '/communities/[id]', '/notifications'];

export const privateRoutes: Routes = ['/profile', '/settings', '/manager/communities/add'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary'];

export const managerRoutes: Routes = ['/manager', '/manager/beneficiaries', '/manager/beneficiaries/[id]', '/communities', '/communities/[id]', '/manager/managers'];

export const ambassadorRoutes: Routes = ['/requests'];
