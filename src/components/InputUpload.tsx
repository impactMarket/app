import {
    InputUpload as BaseInputUpload,
    InputUploadProps as BaseInputUploadProps,
    Text
} from '@impact-market/ui';
import { Controller } from 'react-hook-form';
import React from 'react';

type InputUploadProps = {
    control?: any;
    label?: string | React.ReactNode;
};

const InputUpload: React.FC<InputUploadProps & BaseInputUploadProps> = (
    props
) => {
    const { control, label, name, ...forwardProps } = props;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <BaseInputUpload {...field} {...forwardProps}>
                    {label && (
                        <Text g500 small>
                            {label}
                        </Text>
                    )}
                </BaseInputUpload>
            )}
        />
    );
};

export default InputUpload;
