/* eslint-disable no-nested-ternary */
import { useGetExchangeRatesQuery } from '../../api/generic';
import React from 'react';

export default function ExchangeRate() {
    // Using a query hook automatically fetches data and returns query values
    const { data, error, isLoading } = useGetExchangeRatesQuery();

    return (
        <div>
            {error ? (
                <>Oh no, there was an error</>
            ) : isLoading ? (
                <>Loading...</>
            ) : data ? (
                <>
                    <h3>{data[0].currency}</h3>
                </>
            ) : null}
        </div>
    );
}
