import {
    Avatar,
    Box,
    CircledIcon,
    Icon,
    Select,
    Sidebar as SidebarBase,
    SidebarMenuGroup,
    SidebarMenuItem,
    SidebarMenuItemProps,
    SidebarUserButton,
    openModal
} from '@impact-market/ui';
import { formatAddress } from '../utils/formatAddress';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { getImage } from '../utils/images';
import { getUserMenu } from './UserMenu';
import { getUserName } from '../utils/users';
import { languagesOptions } from 'src/utils/languages';
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Button from './Button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import String from '../libs/Prismic/components/String';
import extractFromData from '../libs/Prismic/helpers/extractFromData';
import langConfig from 'locales.config';
import styled from 'styled-components';
import useMyCommunity from '../hooks/useMyCommunity';
import useWallet from '../hooks/useWallet';

type User = {
    address?: string;
    ambassador?: {
        community?: string;
        state: number;
    };
    avatarMediaPath?: string;
    beneficiary?: {
        community?: string;
        state: number;
    };
    councilMember?: {
        community?: string;
        state: number;
    };
    currency?: string;
    deleteProcess: boolean;
    firstName?: string;
    lastName?: string;
    loanManager?: {
        community?: string;
        state: number;
    };
    manager?: {
        community?: string;
        state: number;
    };
    roles: any;
};

type MenusState = {
    commonMenu?: SidebarMenuItemProps[];
    flags?: any;
    footerMenu?: SidebarMenuItemProps[];
    menus?: SidebarMenuItemProps[][];
};

const getUserType = (user: User) => {
    if (user?.roles?.includes('manager')) {
        return 'manager';
    }
    if (user?.roles?.includes('pendingManager')) {
        return 'pending-manager';
    }
    if (user?.roles?.includes('beneficiary')) {
        return 'beneficiary';
    }
    if (user?.roles?.includes('ambassador')) {
        return 'ambassador';
    }
    if (user?.roles?.includes('councilMember')) {
        return 'council-member';
    }
    if (user?.roles?.includes('loanManager')) {
        return 'loan-manager';
    }

    return 'donor';
};

const ConnectButton = (props: any) => {
    const { push } = useRouter();
    const [isConnecting, setIsConnecting] = useState(false);

    const { connect } = useWallet();

    const handleConnectClick = async () => {
        setIsConnecting(true);

        await connect();

        setIsConnecting(false);

        push('/');
    };

    return (
        <Button
            {...props}
            icon="coins"
            isLoading={isConnecting}
            onClick={handleConnectClick}
            secondary
        >
            <String id="connectWallet" />
        </Button>
    );
};

const MenuItem = (props: SidebarMenuItemProps & { url?: string }) => {
    const { url, ...forwardProps } = props;

    const isMyCommunity = url?.startsWith('/mycommunity');

    let newUrl = url;

    if (isMyCommunity) {
        const { path } = useMyCommunity();

        newUrl = path;
    }

    const isModal = newUrl?.startsWith('[modal]');

    if (isModal) {
        return (
            <SidebarMenuItem
                {...forwardProps}
                onClick={() =>
                    openModal(newUrl?.replace('[modal]', ''), forwardProps)
                }
            />
        );
    }

    const isInternalLink =
        newUrl?.startsWith('https:///') || newUrl?.startsWith('/');

    const Wrapper = isInternalLink ? Link : (React.Fragment as any);
    const wrapperProps = isInternalLink ? { href: newUrl, passHref: true } : {};
    const linkProps = isInternalLink
        ? { href: newUrl }
        : { href: newUrl, rel: 'noopener noreferrer', target: '_blank' };

    return (
        <Wrapper {...wrapperProps}>
            <SidebarMenuItem {...forwardProps} {...linkProps} />
        </Wrapper>
    );
};

const SidebarFooter = (props: { user?: User; isActive: boolean }) => {
    const { user } = props;
    const { address, wrongNetwork } = useWallet();

    useEffect(() => {
        if (wrongNetwork) {
            openModal('wrongNetwork');
        }
    }, [wrongNetwork]);

    if (user?.deleteProcess) {
        openModal('recoverAccount');

        return (
            <Box show={{ md: 'flex', xs: 'none' }}>
                <ConnectButton fluid />
            </Box>
        );
    }

    if (!address || !user) {
        return (
            <Box show={{ md: 'flex', xs: 'none' }}>
                <ConnectButton fluid />
            </Box>
        );
    }

    return (
        <Link href="/profile" passHref>
            <SidebarUserButton
                {...props}
                address={formatAddress(address, [6, 4])}
                name={getUserName(user)}
                photo={{
                    url: user?.avatarMediaPath
                        ? getImage({
                              filePath: user?.avatarMediaPath,
                              fit: 'cover',
                              height: 40,
                              width: 40
                          })
                        : ''
                }}
            />
        </Link>
    );
};

const SidebarMobileActions = (props: { user?: User }) => {
    const { user } = props;
    const { address } = useWallet();
    const router = useRouter();

    if (!address) {
        return <ConnectButton />;
    }

    if (!user?.avatarMediaPath) {
        return (
            <a onClick={() => router.push('/profile')}>
                <CircledIcon icon="user" />
            </a>
        );
    }

    return (
        <a onClick={() => router.push('/profile')}>
            <Avatar
                url={getImage({
                    filePath: user?.avatarMediaPath,
                    fit: 'cover',
                    height: 40,
                    width: 40
                })}
            />
        </a>
    );
};

const Sidebar = () => {
    const { asPath, locale, push, replace } = useRouter();
    const { user } = useSelector(selectCurrentUser);
    const { address } = useWallet();

    const [data, setData] = useState<MenusState | undefined>();

    const { userConfig, extractFromConfig } = usePrismicData();

    const menu = getUserMenu(!!user ? user?.roles : ['']);

    const checkRoute = (route: string | undefined) =>
        typeof route === 'string' ? asPath.split('?')[0] === route : false;

    const parseMenuItems = (items: any) =>
        items?.map((item: any) => ({
            isActive: checkRoute(item?.url as string),
            ...item
        })) as any;

    useEffect(() => {
        const {
            commonMenu: commonMenuFromPrismic,
            footerMenu: footerMenuFromPrismic,
            userFooterMenu: userFooterMenuFromPrismic
        } = (extractFromConfig('aside') || {}) as any;
        const { data: userConfigData } =
            userConfig?.find(({ uid }: any) => uid === getUserType(user)) || {};
        const {
            items: menuItems,
            withCommon,
            withFooter
        } = (extractFromData(userConfigData, 'asideMenu') || {}) as any;

        const menus = menuItems?.map(({ items }: any) =>
            parseMenuItems(items)
        ) as SidebarMenuItemProps[][];

        const commonMenu = (
            withCommon ? parseMenuItems(commonMenuFromPrismic) : []
        ) as SidebarMenuItemProps[];
        const footerCommonMenu = (
            withFooter ? parseMenuItems(footerMenuFromPrismic) : []
        ) as SidebarMenuItemProps[];
        const footerUserMenu = (
            withFooter && !!user
                ? parseMenuItems(userFooterMenuFromPrismic)
                : []
        ) as SidebarMenuItemProps[];

        const footerMenu = [...footerCommonMenu, ...footerUserMenu];

        setData({
            commonMenu,
            flags: [
                {
                    key: 'notifications',
                    value: user?.notificationsCount
                }
            ],
            footerMenu,
            menus
        });
    }, [asPath, user, locale, address]);

    const footerMenu = () => {
        const userBeneficiary = user?.roles?.includes('beneficiary');
        const removeReportFromArr = data?.footerMenu?.filter(
            (item: any) => item?.uid !== 'reportSuspiciousActivity'
        );

        if (userBeneficiary) {
            return data?.footerMenu;
        }

        if (!userBeneficiary) {
            return removeReportFromArr;
        }

        return data?.footerMenu;
    };

    const LanguageSelect = () => {
        // Styles
        const LanguageSelectStyled = styled(Box)`
            > div {
                > a {
                    box-shadow: none;

                    > div {
                        overflow: unset;
                    }
                }

                > div {
                    top: -190px;
                }
            }
        `;

        const browserLanguage = navigator.language.split('-')[0];

        const expiryDate = new Date();

        expiryDate.setTime(expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        useEffect(() => {
            if (!hasCookie('LOCALE')) {
                setCookie('LOCALE', browserLanguage, {
                    expires: expiryDate,
                    path: '/'
                });
                replace('/', undefined, { locale: browserLanguage });
            }
            if (getCookie('LOCALE') !== locale) {
                replace('/', undefined, {
                    locale: getCookie('LOCALE').toString()
                });
            }
        }, []);

        const changeLanguage = (data: string) => {
            setCookie('LOCALE', data, { expires: expiryDate, path: '/' });
            replace(asPath, '/', { locale: data });
        };

        return (
            <LanguageSelectStyled
                flex
                fLayout="center start"
                mt={0.25}
                pl={0.75}
            >
                <Icon icon="website" w={1.5} h={1.5} g500 />
                <Select
                    onChange={changeLanguage}
                    options={languagesOptions}
                    optionsSearchPlaceholder="language"
                    value={getCookie('LOCALE')?.toString()}
                    renderLabel={() =>
                        langConfig.find(({ shortCode }) => shortCode === locale)
                            ?.label
                    }
                    w="100%"
                />
            </LanguageSelectStyled>
        );
    };

    return (
        <SidebarBase
            footer={
                <SidebarFooter isActive={checkRoute('/profile')} user={user} />
            }
            handleLogoClick={() => push('/')}
            isLoading={!data}
            mobileActions={<SidebarMobileActions user={user} />}
        >
            {!!menu?.length && (
                <SidebarMenuGroup>
                    {menu?.map(
                        (item, index) =>
                            item?.isVisible && (
                                <MenuItem
                                    {...item}
                                    flag={
                                        data?.flags?.find(
                                            (elem: any) => elem.key === item.uid
                                        )?.value || 0
                                    }
                                    key={index}
                                />
                            )
                    )}
                </SidebarMenuGroup>
            )}
            {!!data?.commonMenu?.length && (
                <SidebarMenuGroup
                    isCollapsible={!!data?.menus?.length}
                    title={!!data?.menus?.length ? 'impactMarket' : undefined}
                >
                    {data?.commonMenu.map(
                        (item, index) =>
                            item?.isVisible && (
                                <MenuItem
                                    {...item}
                                    flag={
                                        data?.flags?.find(
                                            (elem: any) => elem.key === item.uid
                                        )?.value || 0
                                    }
                                    key={index}
                                />
                            )
                    )}
                </SidebarMenuGroup>
            )}
            {!!data?.footerMenu?.length && (
                <SidebarMenuGroup mt="auto">
                    {footerMenu()?.map(
                        (item, index) =>
                            item?.isVisible && (
                                <MenuItem
                                    {...item}
                                    flag={
                                        data?.flags?.find(
                                            (elem: any) => elem.key === item.uid
                                        )?.value || 0
                                    }
                                    key={index}
                                />
                            )
                    )}
                    {!address && <LanguageSelect />}
                </SidebarMenuGroup>
            )}
        </SidebarBase>
    );
};

export default Sidebar;
