import { usePrismicData } from './PrismicDataProvider';
import React from 'react';
import RichText, { RichTextProps } from './RichText';
import isEmpty from 'lodash/isEmpty';

type Props = { id: string } & RichTextProps;

const Message = (props: Props) => {
    const { id, ...forwardProps } = props;

    const { messages } = usePrismicData();

    const content = messages?.[id] as any;

    if (isEmpty(content)) {
        return null;
    }

    return <RichText {...forwardProps} content={content} />;
};

export default Message;
