import { usePrismicData } from './PrismicDataProvider';
import { useRouter } from 'next/router';
import React from 'react';
import RichText, { RichTextProps } from './RichText';
import isEmpty from 'lodash/isEmpty';
import localesConfig from '../../../locales.config';

const defaultLocale = localesConfig.find(({ isDefault }) => isDefault)?.code?.toLowerCase() || 'en-us';

type Props = { id: string } & RichTextProps;

const Message = (props: Props) => {
    const { locale } = useRouter();
    const { id, ...forwardProps } = props;

    const { translations } = usePrismicData();

    const content = (translations?.[locale.toLowerCase()]?.messages?.[id] || translations?.[defaultLocale]?.messages?.[id]) as any;

    if (isEmpty(content)) {
        console.log(`No message rich text found with the key "${id}"!`);

        return null;
    }

    return <RichText {...forwardProps} content={content} />;
};

export default Message;
