import { InputUpload as BaseInputUpload, Text } from '@impact-market/ui';
import { Controller } from "react-hook-form";
import React from 'react';

const InputUpload: React.FC<any> = props => {
    const { control, label, name, ...forwardProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <BaseInputUpload {...field} {...forwardProps}>
                    { label && <Text g500 small>{label}</Text> }
                </BaseInputUpload>
            }
        />
    )
}

export default InputUpload;
