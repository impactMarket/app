export type Routes = string[];

export const publicRoutes: Routes = ['/', '/stories', '/proposals'];

export const privateRoutes: Routes = ['/profile', '/settings', '/requests', `/requests/[id]`];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary', '/requests', `/requests/[id]`];

export const managerRoutes: Routes = ['/manager/beneficiaries'];
