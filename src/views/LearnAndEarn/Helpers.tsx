import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';

export const ctaText = (status: string, reward: number) => {
    const { view } = usePrismicData();
    const { earnRewards } = view.data;

    switch (status) {
        case 'available':
            return <RichText
                content={earnRewards}
                medium
                variables={{ reward }}
            />
        case 'started':
            return <String id="continue" />;
        case 'completed':
            return <Message id="viewLessons" />;
        default:
            return 0;
    }
};

export const tabRouter = (state: string) => {
    switch (state) {
        case 'started':
            return 0;
        case 'available':
            return 1;
        case 'completed':
            return 2;
        default:
            return 0;
    }
};