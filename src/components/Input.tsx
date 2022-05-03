import { Input as BaseInput, InputProps, Text } from '@impact-market/ui';
import { Controller, useWatch } from "react-hook-form";
import React, { useEffect, useState } from 'react';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const Input: React.FC<InputProps> = props => {
    const [count, setCount] = useState(0);
    const { control, label, limit, name, ...forwardProps } = props;

    const inputWatch = useWatch({ control, name });
    const { t } = useTranslations();

    useEffect(() => {
        if(inputWatch && limit > 0) {
            setCount(inputWatch.length);
        }
    }, [inputWatch]);

    const setValue = (e: any, onChange: Function) => {
        setCount(e.target.value.length);
        onChange(e);
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <>
                    { label && <Text g700 mb={0.375} medium small>{label}</Text> }
                    <BaseInput maxLength={limit} {...field} onChange={(e: any) => setValue(e, field.onChange)} {...forwardProps} />
                    { limit && <Text g500 mt={0.375} small>{limit - count} {t('charactersLeft')}</Text> }
                </>
            }
        />
    )
}

export default Input;
