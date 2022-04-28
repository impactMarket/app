import { Col, Row } from '@impact-market/ui';
import { countriesOptions } from '../../utils/countries';
import FilterSelect from '../../components/FilterSelect';
import React from 'react';
import useFilters from '../../hooks/useFilters';

const Filters = () => {
    // const { clear, update } = useFilters();
    const { update } = useFilters();

    const updateFilter  = (value: any) => {
            update('country', [value]);  
    }

    return (
        <Row mt={0.625}>
            <Col colSize={{ sm: 6, xs: 12}}>
                <FilterSelect
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
