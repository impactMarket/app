import { Text, TextLink } from '@impact-market/ui';
import React, { useState } from 'react';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const Trim = (props: any) => {
    const [showMore, setShowMore] = useState(false);
    const { message, limit, rows, hideSeeMore, ...forwardProps } = props;
    const splitMessage = message.split('\n');
    const { t } = useTranslations();

    if (message.length <= limit && splitMessage.length <= rows) {
        return <Text {...forwardProps}>{message}</Text>;
    }

    return (
        <>
            <Text {...forwardProps} limit={limit} rows={rows}>
                {showMore
                    ? message
                    : `${splitMessage
                          .slice(0, rows)
                          .join('\n')
                          .substring(0, limit)}...`}
            </Text>
            {!hideSeeMore && (
                <TextLink onClick={() => setShowMore(!showMore)}>
                    {showMore ? t('seeLess') : `${t('seeMore')}...`}
                </TextLink>
            )}
        </>
    );
};

export default Trim;
