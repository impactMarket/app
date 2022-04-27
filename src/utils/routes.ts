export type Routes = string[];

export const publicRoutes: Routes = ['/'];

export const privateRoutes: Routes = ['/profile', '/settings'];

export const demoRoutes: Routes = [];

export const beneficiaryRoutes: Routes = ['/beneficiary', '/requests', `/requests/[id]`];

export const managerRoutes: Routes = [];