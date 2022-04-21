import { InputUpload as BaseInputUpload, InputUploadProps, Text } from '@impact-market/ui';
import React from 'react';

const InputUpload: React.FC<InputUploadProps> = props => {
    const { label, ...forwardProps } = props;

    return (
        <BaseInputUpload {...forwardProps}>
            <Text g500 small>{label}</Text>
        </BaseInputUpload>
    )
}

export default InputUpload;
