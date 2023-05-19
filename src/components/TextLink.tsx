import {
    TextLink as TLink,
    TextLinkProps as TLinkProps
} from '@impact-market/ui';
import Link from 'next/link';
import React from 'react';

type TextLinkProps = TLinkProps & React.LinkHTMLAttributes<HTMLLinkElement>;

const TextLink = (props: TextLinkProps) => {
    const href = !!props?.href
        ? props?.href?.replace('https:///', '/')
        : undefined;
    const isInternal = !!href && href?.startsWith('/');

    const wrapperProps = isInternal ? { href, passHref: true } : {};
    const Wrapper = isInternal ? Link : React.Fragment;
    const additionalProps = isInternal
        ? {}
        : { rel: 'noopener noreferrer', target: '_blank' };
    const forwardProps = { ...additionalProps, ...props };

    return (
        <Wrapper {...(wrapperProps as any)}>
            <TLink {...(forwardProps as any)} />
        </Wrapper>
    );
};

export default TextLink;
