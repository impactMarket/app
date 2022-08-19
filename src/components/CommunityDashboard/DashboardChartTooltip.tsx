import { Card } from '@impact-market/ui';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';

export const CustomTooltip = ({ active, payload, prismicData }: any ) => {   
    // If value is undefined or 0, send it as "0" -> Value Variable from Prismic won't accept 0 (integer)
    const value = Math.round((parseFloat(payload[0]?.value)) * 100) / 100

    // Transform unix date to "dd mmmm"
    const date = new Date(payload[0]?.payload.days)
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'long' });

    if (active && payload && !!payload.length) {
        return (
            <Card>
                <RichText content={prismicData?.chartTooltip} semibold small variables={{ currency: 'cUsd', date: `${day} ${month}`, value: value ? value : '0' }}/>
            </Card>
        );
    } 
    
    return null
}; 
