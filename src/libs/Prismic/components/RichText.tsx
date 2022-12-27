import { Box, GeneratedPropTypes, Text, TextProps } from '@impact-market/ui';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/types';
import React from 'react';
import TextLink from '../../../components/TextLink';
import bracked from '../helpers/bracked';
import parse from '../helpers/parse';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
    align-items: center;
    background: white;
    display: flex;
    height: 100%; 
    justify-content: center;
    width: 100%;

    path {
        animation: dash 1s alternate infinite;
        fill:white;
    }
    
    @keyframes dash {
        to {
            stroke: white;
        }
    }
`;

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
            <TextLink key={key} {...linkProps}>{children}</TextLink>
        );
    }

    // TODO use UI Image comp
    if (type === 'image') {
        return <img src={node.url} style={{maxWidth: '100%'}} />;
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
        )
    }

    if (type === 'preformatted') {
        const { text } = node;

        return (
            <Box style={{position: 'relative'}}>
                <LoadingWrapper style={{background: 'white', height: '100%', position: 'absolute', width: '100%', zIndex: '0'}}>
                    <svg fill="none" height="100px" viewBox="0 0 45 43" width="100px" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.3679 11.9829C30.8269 13.7793 32.4061 16.6667 32.4061 19.9236C32.4061 25.3491 28.0079 29.7473 22.5824 29.7473C17.1569 29.7473 12.7587 25.3491 12.7587 19.9236C12.7587 16.6667 14.3379 13.7793 16.7969 11.9829C19.3073 10.1489 19.8557 6.62701 18.0217 4.11658C16.1877 1.60615 12.6658 1.05779 10.1554 2.89179C4.91955 6.71682 1.5 12.9212 1.5 19.9236C1.5 31.567 10.9389 41.0059 22.5824 41.0059C34.2259 41.0059 43.6648 31.567 43.6648 19.9236C43.6648 12.9212 40.2452 6.71682 35.0094 2.89179C32.499 1.05779 28.9771 1.60615 27.1431 4.11658" stroke="#2362FB" strokeLinecap="round" strokeWidth="2.66592"/>
                        <path d="M16.3644 12.3171C14.1583 14.1233 12.7583 16.8587 12.7583 19.9234C12.7583 25.3489 17.1565 29.7471 22.582 29.7471C28.0075 29.7471 32.4057 25.3489 32.4057 19.9234C32.4057 16.8587 31.0057 14.1233 28.7996 12.3171C27.5731 11.3131 27.3929 9.50494 28.3969 8.27854C29.401 7.05213 31.2091 6.87187 32.4355 7.8759C35.9161 10.7254 38.1454 15.0652 38.1454 19.9234C38.1454 28.5188 31.1774 35.4868 22.582 35.4868C13.9865 35.4868 7.01855 28.5188 7.01855 19.9234C7.01855 15.0652 9.24788 10.7254 12.7285 7.8759" stroke="#2362FB" strokeLinecap="round" strokeWidth="2.66592"/>
                    </svg>
                </LoadingWrapper>
                <Box style={{position: 'relative'}}>
                    {parse(text)}
                </Box>
            </Box>
        )
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
