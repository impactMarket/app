import { Sidebar as BaseSidebar, SidebarProps } from '@impact-market/ui';
import { formatAddress } from '../utils/formatAddress';
import { getImage } from '../utils/images';
import { getUserName } from '../utils/users';
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Button from './Button';
import React, { useEffect, useState } from 'react';
import String from '../libs/Prismic/components/String';
import extractFromData from '../libs/Prismic/helpers/extractFromData';
import useWallet from '../hooks/useWallet';

const Sidebar = () => {
    const { asPath, push } = useRouter();
    const { user } = useSelector(selectCurrentUser);

    const [data, setData] = useState<SidebarProps | undefined>();
    const [isConnecting, setIsConnecting] = useState(false);

    const { userConfig, extractFromConfig } =  usePrismicData();
    const { connect } = useWallet();

    const handleConnectClick = async () => {
        setIsConnecting(true);

        await connect();

        setIsConnecting(false);
    }

    const checkRoute = (route: string | undefined) =>
        typeof route === 'string' ? asPath.split('?')[0] === route : false;

    const handleItemClick = (url?: string) => {
        if (!url) {
            return console.log('No url for this menu item');
        }
        if (url?.startsWith('/')) {
            return push(url);
        }
    };

    const parseMenuItems = (items: any) => items.map(({ url, ...forward }: any) => ({
        action: () => handleItemClick(url as string),
        isActive: checkRoute(url as string),
        ...forward
    })) as any;

    useEffect(() => {
        const { address, currency, avatarMediaPath } = user || {};
        const { commonMenu: commonMenuFromPrismic, footerMenu: footerMenuFromPrismic } = (extractFromConfig('aside') || {}) as any;
        const { data: userConfigData } = userConfig?.find(({ uid }: any) => uid === user?.type || uid === 'beneficiary') || {};
        const { items: menuItems, withCommon, withFooter } = (extractFromData(userConfigData, 'asideMenu') || {}) as any;

        const menus = menuItems?.map(({ items }: any) => parseMenuItems(items));

        const commonMenu = withCommon ? parseMenuItems(commonMenuFromPrismic) : [];
        const footerMenu = withFooter ? parseMenuItems(footerMenuFromPrismic) : [];

        const userButton = !!address && {
            action: () => push('/profile'),
            address: formatAddress(address, [6, 4]),
            currency,
            name: getUserName(user),
            photo: {
                url: getImage({ filePath: avatarMediaPath, fit: 'cover', height: 40, width: 40 })
            }
        }

        setData({
            commonMenu,
            footerMenu,
            menus,
            userButton
        })
    }, [user, asPath]);

    return <BaseSidebar {...data} ConnectButton={() => (
        <Button fluid icon="coins" isLoading={isConnecting} onClick={handleConnectClick} secondary>
            <String id="connectWallet" />
        </Button>
    )} />
};

export default Sidebar;