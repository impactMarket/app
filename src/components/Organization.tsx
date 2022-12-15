import React from 'react';

import { Box, Text } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import Image from '../components/Image';
import RichText from '../libs/Prismic/components/RichText';

interface OrganizationProps {
    name: string;
    image: string;
    created: string;
    description: string;
}

const Organization = (props: OrganizationProps) => {
    const { image, name, created, description } = props;
    const { view } = usePrismicData();

    return (
        <Box mt={1.5}>
            <RichText
                content={view.data.headingOrganization}
                flex
                g900
                medium
            />
            <Box flex margin="1.5rem 0">
                <Box
                    h="3rem"
                    minW="3rem"
                    mr="1.5rem"
                    style={{ position: 'relative' }}
                >
                    {image && <Image alt="Community cover image" src={image} />}
                </Box>
                <Box fDirection="column" fLayout="start center" flex>
                    <Text flex g900 medium>
                        {name}
                    </Text>
                    <RichText
                        content={view.data.messageCommunityCreated}
                        g500
                        small
                        variables={{ created }}
                    />
                </Box>
            </Box>

            <Text flex g500 small>
                {description}
            </Text>
        </Box>
    );
};

export default Organization;
