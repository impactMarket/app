import { Alert, Button, colors } from '@impact-market/ui';
import Link from 'next/link';
import Message from '../../../libs/Prismic/components/Message';
import React from 'react';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const DonorAlerts = () => {
    const { t } = useTranslations();

    const addCommunity = () => (
        <Link href="/manager/communities/add" passHref>
            <Button icon="plus">
                {t('addCommunity')}
            </Button>
        </Link>
    )

    return (
        <Alert 
            button={addCommunity()} 
            icon="plusCircle" 
            mb={1} 
            message={<Message id="submittingCommunity" small g800 />}
            title={
                <span style={{ color: colors.g800 }}>
                    {t('submitCommunity')}
                </span>
            }
        />
    );
};

export default DonorAlerts;
