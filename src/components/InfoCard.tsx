import React from 'react';

import { Box, Card, PulseIcon, Text } from '@impact-market/ui';

import String from '../libs/Prismic/components/String';

interface Props {
    text: string;
    label: string;
    icon: string;
}

const InfoCard: React.FC<Props> = (props) => {
    const { label, icon, text } = props;

    return (
        <Card flex h="100%">
            <Box fDirection="column" fLayout="between" flex w="100%">
                <Text g500 mb={0.3} regular small>
                    <String id={label} />
                </Text>
                <Box fLayout="end between" flex>
                    <Box>
                        <Text g900 medium semibold>
                            {text}
                        </Text>
                    </Box>
                    <Box right>
                        <PulseIcon
                            bgS100
                            borderColor="s50"
                            icon={icon}
                            s600
                            size={2}
                        />
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default InfoCard;
