import {
    Avatar,
    Box,
    CircledIcon,
    Sidebar as SidebarBase,
    SidebarMenuGroup,
    SidebarMenuItem,
    SidebarMenuItemProps,
    SidebarUserButton,
    openModal
} from '@impact-market/ui';
import { formatAddress } from '../utils/formatAddress';
import { getImage } from '../utils/images';
import { getNotifications } from '../state/slices/notifications';
import { getUserMenu } from './UserMenu'
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
    ambassador?: {
        community?: string;
        state: number;
    },
    avatarMediaPath?: string;
    beneficiary?: {
        community?: string;
        state: number;
    },
    councilMember?: {
        community?: string;
        state: number;
    },
    currency?: string;
    deleteProcess: boolean;
    firstName?: string;
    lastName?: string;
    manager?: {
        community?: string;
        state: number;
    },
    roles: any;
}

type MenusState = {
    commonMenu?: SidebarMenuItemProps[],
    flags?: any
    footerMenu?: SidebarMenuItemProps[],
    menus?: SidebarMenuItemProps[][],
}

const getUserType = (user: User) => {
    if (user?.roles?.includes('manager')) {
        return 'manager';
    };
    if (user?.roles?.includes('pendingManager')) {
        return 'pending-manager';
    };
    if (user?.roles?.includes('beneficiary')) {
        return 'beneficiary';
    };
    if (user?.roles?.includes('ambassador')) {
        return 'ambassador';
    };
    if (user?.roles?.includes('councilMember')) {
        return 'council-member';
    };

    return 'donor';
}

const ConnectButton = (props: any) => {
    const { push } = useRouter()
    const [isConnecting, setIsConnecting] = useState(false);

    const { connect } = useWallet();

    const handleConnectClick = async () => {
        setIsConnecting(true);

        await connect();
        
        setIsConnecting(false);

        push('/')
    }    

    return (
        <Button {...props} icon="coins" isLoading={isConnecting} onClick={handleConnectClick} secondary>
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
    const linkProps = isInternalLink ? { href: url } : { href: url, rel: 'noopener noreferrer', target: '_blank' }

    return (
        <Wrapper {...wrapperProps}>
            <SidebarMenuItem {...forwardProps} {...linkProps} />
        </Wrapper>
    )
}

const SidebarFooter = (props: { user?: User, isActive: boolean }) => {
    const { user } = props;
    const { address, wrongNetwork } = useWallet();

    useEffect(() => {
        if(wrongNetwork) {
            openModal('wrongNetwork');
        }
    }, [wrongNetwork]);

    if (user?.deleteProcess) {
        openModal('recoverAccount');

        return(
            <Box show={{ md: 'flex', xs: 'none' }}>
                <ConnectButton fluid />
            </Box>
        )
    }

    if (!address || !user) {
        return (
            <Box show={{ md: 'flex', xs: 'none' }}>
                <ConnectButton fluid />
            </Box>
        )
    }

    return (
        <Link href="/profile" passHref>
            <SidebarUserButton
                {...props}
                address={formatAddress(address, [6, 4])}
                name={getUserName(user)}
                photo={{ url: user?.avatarMediaPath ? getImage({ filePath: user?.avatarMediaPath, fit: 'cover', height: 40, width: 40 }) : '' }}
            />
        </Link>
    );
}

const SidebarMobileActions = (props: { user?: User }) => {
    const { user } = props;
    const { address } = useWallet();

    if (!address) {
        return <ConnectButton />
    }

    if (!user?.avatarMediaPath) {
        return <CircledIcon icon="user" />;
    }

    return <Avatar url={getImage({ filePath: user?.avatarMediaPath, fit: 'cover', height: 40, width: 40 })} />;
}

const Sidebar = () => {
    const { asPath, push } = useRouter();
    const { user } = useSelector(selectCurrentUser);
    const { notifications } = useSelector(getNotifications);

    const [data, setData] = useState<MenusState | undefined>();

    const { userConfig, extractFromConfig } = usePrismicData();

    const { address } = useWallet();

    const menu = getUserMenu(!!user?.address && !!address && (address !== user?.address) ? [''] : user?.roles);

    const checkRoute = (route: string | undefined) =>
        typeof route === 'string' ? asPath.split('?')[0] === route : false;

    const parseMenuItems = (items: any) => items?.map((item: any) => ({
        isActive: checkRoute(item?.url as string),
        ...item
    })) as any;

    useEffect(() => {
        const { commonMenu: commonMenuFromPrismic, footerMenu: footerMenuFromPrismic, userFooterMenu: userFooterMenuFromPrismic } = (extractFromConfig('aside') || {}) as any;
        const { data: userConfigData } = userConfig?.find(({ uid }: any) => uid === getUserType(user)) || {};
        const { items: menuItems, withCommon, withFooter } = (extractFromData(userConfigData, 'asideMenu') || {}) as any;

        const menus = menuItems?.map(({ items }: any) => parseMenuItems(items)) as SidebarMenuItemProps[][];

        const commonMenu = (withCommon ? parseMenuItems(commonMenuFromPrismic) : []) as SidebarMenuItemProps[];
        const footerCommonMenu = (withFooter ? parseMenuItems(footerMenuFromPrismic) : []) as SidebarMenuItemProps[];
        const footerUserMenu = (withFooter && !!user ? parseMenuItems(userFooterMenuFromPrismic) : []) as SidebarMenuItemProps[];

        const footerMenu = [...footerCommonMenu, ...footerUserMenu];

        setData({
            commonMenu,
            flags: notifications,
            footerMenu,
            menus
        })
    }, [asPath, user, notifications]);

    const footerMenu = () => {
        const userBeneficiary = user?.roles?.includes('beneficiary')
        const removeReportFromArr = data?.footerMenu?.filter((item: any) => item?.uid !== "reportSuspiciousActivity")

        if (userBeneficiary) {
            return data?.footerMenu
        }

        if (!userBeneficiary) {
            return removeReportFromArr
        }

        return data?.footerMenu
    }
    
    return (
        <SidebarBase
            footer={<SidebarFooter isActive={checkRoute('/profile')} user={user} />}
            handleLogoClick={() => push('/')}
            isLoading={!data}
            mobileActions={<SidebarMobileActions user={user} />}
        >
            {!!menu?.length && (
                <SidebarMenuGroup>
                    {menu?.map((item, index) => item?.isVisible && (
                        <MenuItem {...item} flag={data?.flags.find((elem: any) => elem.key === item.uid)?.value || 0} key={index}/>
                    ))}
                </SidebarMenuGroup>
            )}             
            {!!data?.commonMenu?.length && (
                <SidebarMenuGroup isCollapsible={!!data?.menus?.length} title={!!data?.menus?.length ? 'impactMarket' : undefined}>
                    {data?.commonMenu.map((item, index) => item?.isVisible && (
                        <MenuItem {...item} flag={data?.flags.find((elem: any) => elem.key === item.uid)?.value || 0} key={index}/>
                    ))}
                </SidebarMenuGroup>
            )}
            {!!data?.footerMenu?.length && (
                <SidebarMenuGroup mt="auto">
                        {footerMenu()?.map((item, index) => item?.isVisible && (
                            <MenuItem {...item} flag={data?.flags.find((elem: any) => elem.key === item.uid)?.value || 0} key={index}/>
                        ))}
                </SidebarMenuGroup>
            )}
        </SidebarBase>
    )
};

export default Sidebar;
