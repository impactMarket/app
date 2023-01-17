import Message from '../../libs/Prismic/components/Message';
import React from 'react';
import String from '../../libs/Prismic/components/String';

export const ctaText = (status: string, reward: number) => {
    switch (status) {
        case 'available':
            return `Earn up to ${reward} PACTS`;
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
        case 'available':
            return 0;
        case 'started':
            return 1;
        case 'completed':
            return 2;
        default:
            return 0;
    }
};