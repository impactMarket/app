import { Box, Button, Display, Text, ViewContainer } from '@impact-market/ui';
import { useRouter } from 'next/router';
import React from 'react';
import useFilters from '../hooks/useFilters';

const options = [
    'one',
    'two',
    'three',
    'one more'
]

const Home: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const { query } = useRouter();

    const { clear, isSelected, update } = useFilters();

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>
                Welcome home
                <Box>
                    <input onChange={event => update('test', event?.target?.value)} type="text" value={query?.test || ''} />
                </Box>
                {options.map(option => (
                    <Box key={option} >
                        <input checked={isSelected('option', option)} name={option} onChange={() => update('option', [option])} type="checkbox" />
                        <label htmlFor={option}>
                            {option}
                        </label>
                    </Box>
                ))}
                <Button mt={1} onClick={() => update({ option: options, test: 'this is auto updated' })}>Update entire object</Button>
                <Button ml={1} onClick={() => clear(['option', 'test'])}>Clear</Button>
                <Text mt={1}>
                    Are all the checkboxes selected? {!!isSelected('option', options) ? 'yes' : 'no'}
                </Text>
            </Display>
        </ViewContainer>
    );
};

export default Home;