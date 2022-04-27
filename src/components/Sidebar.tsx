import {
    Avatar,
    Sidebar as SidebarBase,
    SidebarMenuGroup,
    SidebarMenuItem,
    SidebarMenuItemProps,
    SidebarUserButton,
    openModal
} from '@impact-market/ui';
import { formatAddress } from '../utils/formatAddress';
import { getImage } from '../utils/images';
import { getUserName } from '../utils/users';
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Button from './Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import String from '../libs/Prismic/components/String';
import extractFromData from '../libs/Prismic/helpers/extractFromData';
import useWallet from '../hooks/useWallet';

type User = {
    address?: string;
    beneficiary?: {
        community?: string;
        state: number;
    },
    currency?: string;
    firstName?: string;
    lastName?: string;
    avatarMediaPath?: string;
}

type MenusState = {
    commonMenu?: SidebarMenuItemProps[],
    footerMenu?: SidebarMenuItemProps[],
    menus?: SidebarMenuItemProps[][],
}

const getUserType = (user: User) => {
    if (!!user?.beneficiary?.community) {
        return 'beneficiary'
    };

    return 'donor';
}

const ConnectButton = () => {
    const [isConnecting, setIsConnecting] = useState(false);

    const { connect } = useWallet();

    const handleConnectClick = async () => {
        setIsConnecting(true);

        await connect();

        setIsConnecting(false);
    }

    return (
        <Button fluid icon="coins" isLoading={isConnecting} onClick={handleConnectClick} secondary>
            <String id="connectWallet" />
        </Button>
    )
}

const MenuItem = (props: SidebarMenuItemProps & { url?: string }) => {
    const { url, ...forwardProps } = props;

    const isModal = url?.startsWith('[modal]');

    if (isModal) {
        return <SidebarMenuItem {...forwardProps} onClick={() => openModal(url.replace('[modal]', ''), forwardProps)} />
    }

    const isInternalLink = url?.startsWith('https:///') || url?.startsWith('/');

    const Wrapper = isInternalLink ? Link : React.Fragment as any;
    const wrapperProps = isInternalLink ? { href: url, passHref: true } : {};

    return (
        <Wrapper {...wrapperProps}>
            <SidebarMenuItem {...forwardProps} />
        </Wrapper>
    )
}

const SidebarFooter = (props: { user?: User }) => {
    const { user } = props;
    const { address } = useWallet();

    if (!user) {
        return <ConnectButton />
    }
    
    return (
        <Link href="/profile" passHref>
            <SidebarUserButton
                {...user}
                address={formatAddress(address, [6, 4])}
                name={getUserName(user)}
                photo={{ url: getImage({ filePath: user?.avatarMediaPath, fit: 'cover', height: 40, width: 40 }) }}
            />
        </Link>
    );
}

const SidebarMobileActions = (props: { user?: User }) => {
    const { user } = props;

    if (!user) {
        return <ConnectButton />
    }

    if (!user?.avatarMediaPath) {
        return null
    }

    return <Avatar url={getImage({ filePath: user?.avatarMediaPath, fit: 'cover', height: 40, width: 40 })} />;
}

const Sidebar = () => {
    const { asPath } = useRouter();
    const { user } = useSelector(selectCurrentUser);

    const [data, setData] = useState<MenusState | undefined>();

    const { userConfig, extractFromConfig } = usePrismicData();

    const checkRoute = (route: string | undefined) =>
        typeof route === 'string' ? asPath.split('?')[0] === route : false;

    const parseMenuItems = (items: any) => items.map((item: any) => ({
        isActive: checkRoute(item?.url as string),
        ...item
    })) as any;

    useEffect(() => {
        const { commonMenu: commonMenuFromPrismic, footerMenu: footerMenuFromPrismic } = (extractFromConfig('aside') || {}) as any;
        const { data: userConfigData } = userConfig?.find(({ uid }: any) => uid === getUserType(user)) || {};
        const { items: menuItems, withCommon, withFooter } = (extractFromData(userConfigData, 'asideMenu') || {}) as any;

        const menus = menuItems?.map(({ items }: any) => parseMenuItems(items)) as SidebarMenuItemProps[][];

        const commonMenu = (withCommon ? parseMenuItems(commonMenuFromPrismic) : []) as SidebarMenuItemProps[];
        const footerMenu = (withFooter ? parseMenuItems(footerMenuFromPrismic) : []) as SidebarMenuItemProps[];

        setData({
            commonMenu,
            footerMenu,
            menus
        })
    }, [user, asPath]);

    return (
        <SidebarBase
            footer={<SidebarFooter user={user} />}
            isLoading={!data}
            mobileActions={<SidebarMobileActions user={user} />}
        >
            {data?.menus?.map((group, groupIndex) => (
                <SidebarMenuGroup key={groupIndex}>
                    {group.map((item, index) => (
                        <MenuItem {...item} key={index} />
                    ))}
                </SidebarMenuGroup>
            ))}
            {!!data?.commonMenu?.length && (
                <SidebarMenuGroup isCollapsible={!!user} title={!!user ? 'impactMarket' : undefined}>
                    {data?.commonMenu.map((item, index) => (
                        <MenuItem {...item} key={index} />
                    ))}
                </SidebarMenuGroup>
            )}
            {!!data?.footerMenu?.length && (
                <SidebarMenuGroup mt="auto">
                    {data?.footerMenu.map((item, index) => (
                        <MenuItem {...item} key={index} />
                    ))}
                </SidebarMenuGroup>
            )}
        </SidebarBase>
    )
};

export default Sidebar;
