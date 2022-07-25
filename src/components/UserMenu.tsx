/* eslint-disable react-hooks/rules-of-hooks */
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';

export const getUserMenu = (roles: string[]) => {
    const { userConfig } = usePrismicData();

    try {
        const rolesArr = Array.isArray(roles) ? roles : [roles];

        //  Get menus from user's roles
        const activeRoles: any[] = []

        userConfig?.map((prismicData: { uid: string; data: { asideMenuItems: { items: any; }[]; }; }) => 
            rolesArr?.map(role => 
                prismicData?.uid === role && activeRoles?.push(prismicData?.data?.asideMenuItems[0]?.items)
            )
        )

        //  Merge menu's items
        const mergedItems: any[] = []
        
        activeRoles?.map(
            roleMenu =>
                roleMenu?.map((items: any) =>
                    mergedItems?.push(items)
                )
        );  

        //  Delete duplicated items
        const duplicates: any[] = [];
        
        const deletedDuplicates = mergedItems?.filter(item => {
            const isDuplicate = duplicates?.includes(item?.url);

            if (!isDuplicate) {
                duplicates?.push(item?.url);

                return true;
            }

            return false;
        });
    
        return deletedDuplicates;

    } catch (error) {
        console.log(error);
        
        return [];
    }
}
