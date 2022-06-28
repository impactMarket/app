import React from 'react';

import { Box, Icon, TextLink } from '@impact-market/ui';

interface Props {
    label: string;
    icon: string;
    href: string;
}

const SocialLink: React.FC<Props> = (props) => {
    const { label, icon, href } = props;

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
