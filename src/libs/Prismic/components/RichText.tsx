import { Box, GeneratedPropTypes, Text, TextProps } from '@impact-market/ui';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';
import React from 'react';
import TextLink from '../../../components/TextLink';
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
            <TextLink key={key} {...linkProps}>
                {children}
            </TextLink>
        );
    }

    // TODO use UI Image comp
    if (type === 'image') {
        return (
            <Box style={{ position: 'relative' }}>
                <Box style={{ maxHeight: '100%', position: 'relative' }}>
                    <img
                        src={node.url}
                        style={{
                            maxWidth: '100%',
                            position: 'relative',
                            zIndex: 1
                        }}
                        width="100%"
                    />
                </Box>
            </Box>
        );
    }

    if (type === 'paragraph' && !node?.text?.length && !node?.spans?.length) {
        return <br />;
    }

    if (type === 'span') {
        const { text } = node;
        const content = bracked(text, variables);

        return parse(content, components);
    }

    if (type.includes('heading')) {
        const { text } = node;

        return (
            <Text as="div" {...forwardProps} g900 large semibold>
                {parse(text)}
            </Text>
        );
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
