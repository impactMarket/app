import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

export const ctaText = (status: string, reward: number, isLAEUser: boolean) => {
    const { view } = usePrismicData();
    const { earnRewards } = view.data;

    switch (status) {
        case 'available':
            return isLAEUser ? (
                <RichText content={earnRewards} medium variables={{ reward }} />
            ) : (
                <Message id="viewLessons" />
            );

        case 'started':
            return <String id="continue" />;
        case 'completed' || !isLAEUser:
            return <Message id="viewLessons" />;
        default:
            return 0;
    }
};