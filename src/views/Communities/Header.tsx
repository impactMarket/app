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
import useTranslations from '../../libs/Prismic/hooks/useTranslations';
import useWallet from '../../hooks/useWallet';

const Header = ({ activeTab, supportingCountries, supportingCommunities, user }: any) => {
    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    const { t } = useTranslations();
    const { address } = useWallet();

    return (
        <Row>
            <Col colSize={{ sm: (!user?.roles.length) ? 6 : 12, xs: 12 }}>
                <Display g900 medium>
                    {title}
                </Display>

                <Box mt={0.25}>
                    {(user?.roles.includes('ambassador') && activeTab === 'myCommunities') ?
                        <RichText 
                            content={content} 
                            g500 
                            mt={0.25} 
                            variables = {{ 
                                communities: supportingCommunities || '0',
                                countries: supportingCountries?.toString() || '0'
                            }} 
                        /> 
                    :
                        <Message
                            g500
                            id="communitiesJoined"
                            mt={0.25}
                            w="100%"
                        />
                    }
                </Box>
            </Col>

            {/* If user role is empty (which means he's a donor), show Add Community button */}
            {!user?.roles.length && !!address &&
                <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 1, xs: 0 }} tAlign={{ sm: 'right', xs: 'left' }}>
                    <Link href="/manager/communities/add" passHref>
                        <Button icon="plus">
                            {t('addCommunity')}
                        </Button>
                    </Link>
                </Col>
            }
        </Row>
    )
};

export default Header;
