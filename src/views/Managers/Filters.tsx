import { Box} from '@impact-market/ui';
import Input from '../../components/Input';
import React from 'react';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

let timeoutFilter = null as any;

const Filters: React.FC = () => {
    const { t } = useTranslations();
    const { update } = useFilters();

    const onInputChange = (field: string, value: string | number, timeout: number = 0) => {
        if (timeoutFilter) clearTimeout(timeoutFilter);
        timeoutFilter = setTimeout(() => update(field, value), timeout);
    };

    return (
        <Box maxW={25}>
            <Input 
                icon="search"  
                onKeyUp={(e: any) => onInputChange('search', e.target.value, 1000)}
                placeholder={t('searchForName')}
            />
        </Box>
    );
};

export default Filters;
