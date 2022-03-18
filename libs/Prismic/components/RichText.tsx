/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { GeneratedPropTypes, Text, TextProps } from '@impact-market/ui';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';
import React from 'react';
import bracked from '../helpers/bracked';
import parse from '../helpers/parse';

type SerializerOptions = {
    components?: { [key: string]: any };
    serializerProps?: { [key: string]: GeneratedPropTypes };
    variables?: { [key: string]: string };
};

type SerializerFunction = (...args: any | any[]) => any;

// eslint-disable-next-line max-params
const serializer: SerializerFunction = ({
    children,
    key,
    node,
    type,
    ...options
}) => {
    const { components = {}, serializerProps = {}, variables = {} } =
        options || ({} as SerializerOptions);
    const forwardProps = serializerProps?.[type] || {};

    if (type === 'hyperlink') {
        const { url: href, ...otherProps } = node?.data;

        const linkProps = { ...otherProps, ...forwardProps, href };

        return (
            <a key={key} {...linkProps}>
               {children}
            </a>
        );
    }

    // TODO use UI Image comp
    if (type === 'image') {
        return <img {...node} />;
    }

    if (type === 'span') {
        const { text } = node;
        const content = bracked(text, variables);

        return parse(content, components);
    }

    return null;
};

export type RichTextProps = {
    components?: {
        [key: string]: any;
    };
    content?: RichTextField | string;
    serializerProps?: {
        paragraph?: TextProps;
        hyperlink?: TextProps;
    };
    variables?: {
        [key: string]: any;
    };
} & TextProps;

const RichText = (props: RichTextProps) => {
    const {
        components = {},
        content,
        serializerProps,
        variables,
        ...forwardProps
    } = props;

    if (typeof content === 'string') {
        const stringContent = bracked(content, variables);

        return (
            <Text as="div" {...forwardProps}>
                {parse(stringContent)}
            </Text>
        );
    }

    return (
        <Text as="div" {...forwardProps}>
            {/* TODO use UI RichContent comp to wrap this */}
            <PrismicRichText
                // eslint-disable-next-line max-params
                components={(type, node, content, children, key) =>
                    serializer({
                        children,
                        components,
                        content,
                        key,
                        node,
                        serializerProps,
                        type,
                        variables
                    })
                }
                field={content}
            />
        </Text>
    );
};

export default RichText;
