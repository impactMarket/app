import React from 'react';

import { Box, Icon, TextLink } from '@impact-market/ui';

interface SocialMedia {
    label: string;
    icon: string;
    href: string;
}

const SocialLink = (social: SocialMedia) => {
    const { label, icon, href } = social;
    const regex =
        /(?:https?:\/\/)?(?:www.)?(?:twitter|medium|facebook|vimeo|instagram)(?:.com\/)?([@a-zA-Z0-9-_]+)/im;

    return (
        <Box fLayout="center start" flex mr={1.8} mt={0.5}>
            <Icon g400 icon={icon} />
            <Icon g400 icon={icon} />
            <TextLink medium ml={0.25} onClick={() => window.open(href)}>
                {label?.match(regex) ? label?.match(regex)[1] : label}
                {label?.match(regex) ? label?.match(regex)[1] : label}
            </TextLink>
        </Box>
    );
};

export default SocialLink;
