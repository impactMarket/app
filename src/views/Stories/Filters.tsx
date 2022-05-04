import { Col, Row } from '@impact-market/ui';
import { getCountryNameFromInitials } from '../../utils/countries';
import { useGetCountryByCommunitiesMutation } from '../../api/community';
import React, { useEffect, useState } from 'react';
import Select from '../../components/Select';
import useFilters from '../../hooks/useFilters';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

interface CountriesList {
    label: string;
    value: string;
}

const Filters = () => {
    const { update, getByKey } = useFilters();
    const [getCountries] = useGetCountryByCommunitiesMutation();
    const [countries, setCountries] = useState<CountriesList[]>([]);
    const { t } = useTranslations();

    useEffect(() => {
        const getCountriesMethod = async () => {
            try {
                const countriesRequest = await getCountries().unwrap();

                const countriesRequestArray = countriesRequest.map((data) => ({
                    label: getCountryNameFromInitials(data.country),
                    value: data.country
                }));

                setCountries([...countriesRequestArray]);
            } catch (error) {
                console.log(error);
            }
        };

        getCountriesMethod();
    }, []);

    return (
        <Row mt={0.625}>
            <Col colSize={{ sm: 3, xs: 12 }}>
                <Select
                    callback={(value: any) => update('country', value)}
                    clearLabel={t('clear')}
                    initialValue={getByKey('country')}
                    isClearable
                    isMultiple
                    options={countries}
                    showFlag
                    withOptionsSearch
                />
            </Col>
        </Row>
    );
};

export default Filters;
