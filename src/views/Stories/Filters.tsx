import { Col, Row } from '@impact-market/ui';
import { countriesOptions } from '../../utils/countries';
import React from 'react';
import Select from '../../components/Select';
import useFilters from '../../hooks/useFilters';

const Filters = () => {
    const { update } = useFilters();

    const updateFilter  = (value: any) => {
        update('country', [value]);  
    }

    return (
        <Row mt={0.625}>
            <Col colSize={{ sm: 6, xs: 12}}>
                <Select
                    callback={updateFilter}
                    isMultiple
                    options={countriesOptions}
                    renderLabelWithIcon={countriesOptions}
                    withOptionsSearch
                />
            </Col>
        </Row>
    );
};

export default Filters;
