import React from 'react';

import {
    Box,
    Button,
    Col,
    Display,
    Row
} from '@impact-market/ui';

import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Link from 'next/link';
import Message from '../../libs/Prismic/components/Message';
import RichText from '../../libs/Prismic/components/RichText';

const Header = ({ activeTab, loading, supportingCommunities, user }: any) => {
    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;

    //  Get how many countries the ambassador is suporting
    const supportingCountries = () => {
        const supportingCountries = [] as any

        supportingCommunities?.data?.rows.map((community: any) => {
            supportingCountries.push(community?.country)
        })

        const deleteDuplicatedCountries = [...new Set(supportingCountries)];

        return deleteDuplicatedCountries.length
    }

    return (
        <Row>
            <Col colSize={{ sm: (!user?.roles.length) ? 6 : 12, xs: 12 }}>
                <Display g900 medium>
                    {title}
                </Display>  

                <Box mt={0.25}>
                    {(user?.roles.includes('ambassador') && activeTab === 'myCommunities') ?
                        !loading && <RichText content={content} g500 mt={0.25} variables = {{ communities: supportingCommunities?.data?.count, countries: supportingCountries() }} /> 
                    :
                        <Message 
                            g500
                            id="communitiesJoined" 
                            mt={0.25}
                        />
                    } 
                </Box>
            </Col>

            {/* If user role is empty (which means he's a donor), show Add Community button */}
            {!user?.roles.length &&
                <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0 }} tAlign={{ sm: 'right', xs: 'left' }}>
                    <Link href="/manager/communities/add" passHref>
                        <Button icon="plus">
                            {/* Todo: Add string on prismic */}
                            Add Community
                        </Button>
                    </Link>
                </Col>
            }
        </Row>
    )
};

export default Header;
