import { Controller } from "react-hook-form";
import { Text } from '@impact-market/ui';
import React from 'react';

const Select: React.FC<any> = props => {
    const { control, label, name, options, ...forwardProps } = props;

    // TODO: colocar Select da UI e textos no Prismic se necessário

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) =>
                <>
                    { label && <Text g700 mb={0.375} medium small>{label}</Text> }
                    <select {...field} {...forwardProps} style={{ border: '1px solid black', width: '100%' }}>
                        <option>Select</option>
                        { 
                            options?.length > 0 && options.map(([key, value]: any) => { 
                                return <option key={key} value={key}>{value.name}</option>;
                            }) 
                        }
                    </select>
                </>
            }
        />
    )
}

export default Select;
