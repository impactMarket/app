import { Button as BaseButton, ButtonProps } from '@impact-market/ui';
import Link from 'next/link';
import React from 'react';

const Button: React.FC<ButtonProps> = props => {
    const { href: url, ...forwardProps } = props;
    const href = url?.replace('https:///', '/');

    const isInternal = href?.startsWith('/');

    const Wrapper = isInternal ? Link : React.Fragment as any;
    const wrapperProps = isInternal ? { href, passHref: true } : {};
    const buttonExtraProps = !!href && !isInternal ? { rel: 'noopener', target: '_blank' } : {};

    return (
        <Wrapper {...wrapperProps}>
            <BaseButton {...forwardProps} {...buttonExtraProps} href={href} />
        </Wrapper>
    )
}

export default Button;
