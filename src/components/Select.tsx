import { Select as BaseSelect, Col, CountryFlag, Icon, Row, Text } from '@impact-market/ui';
import { Controller } from "react-hook-form";
import React, { useState } from 'react';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const Select: React.FC<any> = props => {
    const { showFlag, control, label, name, placeholder, callback, initialValue, ...forwardProps } = props;

    const [value, setValue] = useState(initialValue || '');
    const { t } = useTranslations();

    const handleSelect = (value: any) => {
        if (typeof callback === 'function') {
            callback(value);
        }

        return setValue(value);
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
