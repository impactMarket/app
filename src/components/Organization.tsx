import React from 'react';

import { Box, Text } from '@impact-market/ui';
import Image from '../components/Image';

interface Props {
    name: string;
    image: string;
    created: string;
    description: string;
}

const SocialLink: React.FC<Props> = (props) => {
    const { image, name, created, description } = props;

    return (
        <Box mt={1.5}>
            {/* ADD TRANSLATION */}
            <Text flex g900 medium>
                Organization
            </Text>

            <Box flex margin="1.5rem 0">
                <Box
                    h="3rem"
                    minW="3rem"
                    mr="1.5rem"
                    style={{ position: 'relative' }}
                >
                    <Image alt="Community cover image" src={image} />
                </Box>
                <Box fDirection="column" fLayout="start center" flex>
                    <Text flex g900 medium>
                        {name}
                    </Text>
                    {/* ADD TRANSLATION */}
                    <Text flex g500 small>
                        Created community on {created}
                    </Text>
                </Box>
            </Box>

            <Text flex g500 small>
                {description}
            </Text>
        </Box>
    );
};

export default SocialLink;
