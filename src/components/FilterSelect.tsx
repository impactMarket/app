import { Select as BaseSelect, Col, CountryFlag, Icon, Row, Text } from '@impact-market/ui';
import React, { useState } from 'react';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const FilterSelect: React.FC<any> = props => {
    const { showFlag, control, label, name, placeholder, callback, ...forwardProps } = props;

    const [value, setValue] = useState('');
    const { t } = useTranslations();

    const handleSelect = (value: any) => {

        if(typeof callback === 'function') {
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

    // TODO: colocar textos no Prismic

    const renderLabel = ({ selected }: any) => {
        if (selected?.label) {
            return renderLabelWithIcon(selected?.label, selected?.value);
        }
    
        if (Array.isArray(selected) && selected.length) {
            return <Text g900>Selected ({selected.length})</Text>;
        }
    
        return <Text g500>{placeholder || 'Select an option'}</Text>;
    };

    const renderOption = ({ isActive, label, value }: any) => {
        return (
            <>
                {renderLabelWithIcon(label, value)}
                {isActive && <Icon icon="check" p600 size={1.25} />}
            </>
        );
    };
    
    return (
        <>
        { label && <Text g700 mb={0.375} medium small>{label}</Text> }
        <BaseSelect
            onChange={handleSelect}
            optionsSearchPlaceholder={t('search')?.toLowerCase()}
            renderLabel={renderLabel}
            renderOption={renderOption}
            value={value}
            {...forwardProps}
        />
    </>
    )
}

export default FilterSelect;
