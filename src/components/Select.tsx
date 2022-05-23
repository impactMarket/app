import { Select as BaseSelect, SelectProps as BaseSelectProps, Box, CountryFlag, Icon, Text } from '@impact-market/ui';
import { Controller } from "react-hook-form";
import React, { useState } from 'react';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

type Partial<BaseSelectProps> = {
    [P in keyof BaseSelectProps]?: BaseSelectProps[P];
};

type SelectProps = {
    callback?: Function;
    control?: any; 
    initialValue?: any;
    isMultiple?: boolean;
    label?: string, 
    placeholder?: string;
    name?: string;
    rules?: Object;
    showFlag?: boolean;
};

const Select: React.FC<SelectProps & Partial<BaseSelectProps>> = props => {
    const { callback, control, initialValue, isMultiple, label, placeholder, name, rules, showFlag, ...forwardProps } = props;

    const newValue = isMultiple && initialValue && !Array.isArray(initialValue) ? [initialValue]: initialValue;
    const [value, setValue] = useState(newValue || '');
    const { t } = useTranslations();
    const { getByKey } = useFilters();

    const clearLabel = () => {
        const textProps = getByKey('country') ? { p600: true } : { g400: true };
    
        return (
            <Text medium {...textProps}>
                {t('clear')}...
            </Text>
        );
    };

    const handleSelect = (e: any) => {
        if (typeof callback === 'function') {
            callback(e);
        }

        return setValue(e);
    };

    const renderLabelWithIcon = (label: string, value: string) => {
        return (
            <Box fLayout="center start" flex>
                {showFlag && <CountryFlag countryCode={value} height={1.2} mr={0.5} />}
                <Text g900>{label || value}</Text>
            </Box>
        );
    };

    const renderLabel = ({ selected }: any) => {
        if (selected?.label) {
            return renderLabelWithIcon(selected?.label, selected?.value);
        }
    
        if (Array.isArray(selected) && selected.length) {
            return <Text g900>{t('selected')} ({selected.length})</Text>;
        }
    
        return <Text g500>{placeholder || t('selectAnOption')}</Text>;
    };

    const renderOption = ({ isActive, label, value }: any) => {
        return (
            <>
                {renderLabelWithIcon(label, value)}
                {isActive && <Icon icon="check" p600 size={1.25} />}
            </>
        );
    };

    const renderInput = (field?: any) => {
        return (
            <>
                { label && <Text g700 mb={0.375} medium small>{label}</Text> }
                <BaseSelect
                    clearLabel={clearLabel}
                    isMultiple={isMultiple}
                    onChange={handleSelect}
                    optionsSearchPlaceholder={t('search')}
                    renderLabel={renderLabel}
                    renderOption={renderOption}
                    value={value}
                    {...field} 
                    {...forwardProps}
                />
            </>
        );
    }
    
    return (
        <>
            { 
                control ?
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => renderInput(field)}
                    rules={rules}
                />
                :
                renderInput()
            }
        </>
    )
}

export default Select;
