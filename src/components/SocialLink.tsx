import React from 'react';

import { Box, Icon, TextLink } from '@impact-market/ui';

interface SocialMedia {
    label: string;
    icon: string;
    href: string;
}

const SocialLink = (social: SocialMedia) => {
    const { label, icon, href } = social;

    return (
        <Box fLayout="center start" flex mr={1.8} mt={0.5}>
            <Icon icon={icon} />
            <TextLink medium ml={0.25} onClick={() => window.open(`//${href}`)}>
                {label}
            </TextLink>
        </Box>
    );
};

export default SocialLink;
