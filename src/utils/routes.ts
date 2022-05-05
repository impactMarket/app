export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals'];

export const privateRoutes: Routes = ['/profile', '/settings'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary', '/requests', '/communities', '/communities/[id]'];

export const managerRoutes: Routes = ['/manager/beneficiaries', '/communities', '/communities/[id]'];
