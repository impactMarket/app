import React from 'react';

import { Box, Card, PulseIcon, Text } from '@impact-market/ui';

import String from '../libs/Prismic/components/String';

interface Props {
    text: string;
    label: string;
    icon: string;
}

const BeneficiaryCard: React.FC<Props> = (props) => {
    const { label, icon, text } = props;

    return (
        <Card>
            <Text g500 mb={0.3} regular small>
                <String id={label} />
            </Text>
            <Box fLayout="between" flex>
                <Text g900 medium semibold>
                    {text}
                </Text>
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
        </Card>
    );
};

export default BeneficiaryCard;
