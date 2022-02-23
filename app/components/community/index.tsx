/* eslint-disable no-nested-ternary */
import { useGetCommunityByIdQuery } from '../../api/community';
import React from 'react';

export default function Community() {
    // Using a query hook automatically fetches data and returns query values
    const { data, error, isLoading } = useGetCommunityByIdQuery(2);

    return (
        <div>
            {error ? (
                <>Oh no, there was an error</>
            ) : isLoading ? (
                <>Loading...</>
            ) : data ? (
                <>
                    <h3>{data.data.name}</h3>
                </>
            ) : null}
        </div>
    );
}
