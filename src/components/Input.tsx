import { Input as BaseInput, InputProps, Text } from '@impact-market/ui';
import { Controller } from "react-hook-form";
import React from 'react';

const Input: React.FC<InputProps> = props => {
    const { control, label, name, ...forwardProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <>
                    <Text g700 mb={0.375} medium small>{label}</Text>
                    <BaseInput {...field} {...forwardProps} />
                </>
            }
        />
        // <>
        //     <Text g700 mb={0.375} medium small>{label}</Text>
        //     <BaseInput {...field} {...forwardProps} />
        // </>
    )
}

export default Input;
