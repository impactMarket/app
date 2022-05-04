import { Select as BaseSelect, Col, CountryFlag, Icon, Row, Text } from '@impact-market/ui';
import { Controller } from "react-hook-form";
import React, { useState } from 'react';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

// type SelectProps = {
//     callback?: Function;
//     control?: any; 
//     initialValue?: any;
//     isMultiple?: boolean;
//     label?: string, 
//     placeholder?: string;
//     name?: string;
//     showFlag?: boolean;
// } & BaseSelectProps;

const Select: React.FC<any> = props => {
    const { callback, control, initialValue, isMultiple, label, placeholder, name, showFlag, ...forwardProps } = props;

    const newValue = isMultiple && initialValue && !Array.isArray(initialValue) ? [initialValue]: initialValue;
    const [value, setValue] = useState(newValue || '');
    const { t } = useTranslations();

    const handleSelect = (e: any) => {
        if (typeof callback === 'function') {
            callback(e);
        }

        return setValue(e);
    };

    const renderLabelWithIcon = (label: string, value: string) => {
        return (
            <Row fLayout="center start" margin={0}>
                {showFlag && <Col padding={0}><CountryFlag countryCode={value} mr={0.5} /></Col>}
                <Col padding={0}><Text g900>{label || value}</Text></Col>
            </Row>
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
                />
                :
                renderInput()
            }
        </>
    )
}

export default Select;
