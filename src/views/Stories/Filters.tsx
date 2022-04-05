import { Col, Row } from '@impact-market/ui';
// import {
//     SelectCommunity,
//     useGetCommunitiesMutation
// } from '../../api/community';
import React from 'react';
import countriesJSON from '../../assets/countries.json';
import useFilters from '../../hooks/useFilters';

const Filters = () => {
    const { clear, update } = useFilters();

    return (
        <Row mt={0.625}>
            <Col colSize={2}>
                {/* // TODO add select input from UI */}
                <select multiple style={{ width: '100%' }}>
                    <option onClick={() => clear('country')}>All</option>
                    {Object.keys(countriesJSON).map((contryName, index) => {
                        return (
                            <option
                                key={index}
                                onClick={() => update('country', [contryName])}
                                value={contryName}
                            >
                                {
                                    countriesJSON[
                                        contryName as keyof typeof countriesJSON
                                    ].name
                                }
                            </option>
                        );
                    })}
                </select>
            </Col>
        </Row>
    );
};

export default Filters;
