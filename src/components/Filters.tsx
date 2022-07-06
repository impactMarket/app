import { Box } from '@impact-market/ui';
import Input from './Input';
import React from 'react';
import useFilters from '../hooks/useFilters';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

let timeoutFilter: ReturnType<typeof setTimeout> = null;

interface FilterProps {
    property: string;
}

const Filters = (props: FilterProps) => {
    const { property } = props;
    const { t } = useTranslations();
    const { update } = useFilters();

    const onInputChange = ( field: string, value: string | number, timeout: number = 0 ) => {
        if (timeoutFilter) clearTimeout(timeoutFilter);
        timeoutFilter = setTimeout(() => update(field, value), timeout);
    };

    return (
        <Box maxW={25} mt={1.5}>
            <Input
                icon="search"
                onKeyUp={(e: any) =>
                    onInputChange(property, e.target.value, 1000)
                }
                placeholder={t('searchForName')}
            />
        </Box>
    );
};

export default Filters;
