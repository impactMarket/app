import { Input as BaseInput, InputProps, Text } from '@impact-market/ui';
import React from 'react';

const Input: React.FC<InputProps> = props => {
    const { label, ...forwardProps } = props;

    return (
        <>
            <Text g700 mb={0.375} medium small>{label}</Text>
            <BaseInput {...forwardProps} />
        </>
    )
}

export default Input;
