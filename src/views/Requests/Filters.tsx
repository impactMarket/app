import { Box, Row, Spinner } from '@impact-market/ui';
import NameFilter from '../../components/Filters';
import React, { useState } from 'react';
import Select from '../../components/Select';
import config from '../../../config';
import useCommunitiesReviewsByCountry from '../../hooks/useCommunitiesReviewsByCountry';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

const Filters = ({ status }: any) => {
    const { t } = useTranslations();
    const { getByKey, update } = useFilters();
    const { communitiesCountries, loadingCountries } =
        useCommunitiesReviewsByCountry(status, fetcher);
    const countries = getByKey('country')
        ? (getByKey('country') as string).split(';')
        : [];
    const [selectedCountries, setSelectedCountries] = useState(countries);

    return (
        <Box fLayout="center start" inlineFlex mt={0.8} w="100%">
            <NameFilter
                margin="0 1 0 0"
                property="search"
                placeholder={t('searchForName')}
            />

            {!loadingCountries ? (
                <Select
                    callback={(value: any) => {
                        setSelectedCountries(value);
                        update('country', value.join(';'));
                    }}
                    initialValue={getByKey('country')}
                    isClearable
                    isMultiple
                    options={communitiesCountries}
                    placeholder={`${t(
                        'allCountries'
                    )} (${communitiesCountries?.length})`}
                    showFlag
                    value={selectedCountries}
                    withOptionsSearch
                />
            ) : (
                <Row fLayout="center" h="0.1" minW="160px">
                    <Spinner isActive />
                </Row>
            )}
        </Box>
    );
};

export default Filters;
