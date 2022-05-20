export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals', '/communities', '/communities/[id]'];

export const privateRoutes: Routes = ['/profile', '/settings'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary'];

export const managerRoutes: Routes = ['/manager/beneficiaries'];

export const ambassadorRoutes: Routes = ['/requests'];
