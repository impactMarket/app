import React from 'react';

import {
    Tab,
    TabList,
    Tabs,
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';
import useFilters from '../../hooks/useFilters';


const CountryTabs = ({ userCountry, allCountries, otherCountries, setMyCountrySelected }: any) => {  
    const { update, getByKey } = useFilters();

    //  Get how many communties there are in My Country
    const myCountryCommunities = () => {
        let myCountryCommunities = 0 as number

        !!Object.keys(allCountries).length && (
            allCountries.filter((countryName: any) => countryName?.country === userCountry).map((country: any) => {
                myCountryCommunities = parseInt(country?.pending, 10) + parseInt(country?.claimed, 10) + parseInt(country?.declined, 10) 
            }
        ))

        return myCountryCommunities
    }

    //  Get how many communties there are in Other Countries
    const otherCountriesCommunities = () => {
        const otherCountriesCommunities = [] as any

        !!Object.keys(otherCountries).length && (
            otherCountries.map((country: any) => {
                otherCountriesCommunities.push(parseInt(country?.pending, 10) + parseInt(country?.claimed, 10) + parseInt(country?.declined, 10) )
            })
        )

        return otherCountriesCommunities.reduce((a: any, b: any) => a + b, 0)
    }

    const handleClickOnCountryFilter = (countryFilter: any, myCountrySelected: any) => {
        setMyCountrySelected(myCountrySelected); 
        update('country', countryFilter)
    }
    

    return (
            <Tabs defaultIndex={
                // eslint-disable-next-line no-nested-ternary
                getByKey('country') === 'mycountry' ? 0 :
                getByKey('country') === 'othercountries' ? 1 : 0
            }>
                <TabList>
                    <Tab
                        number={myCountryCommunities()}
                        onClick={() => handleClickOnCountryFilter('mycountry', true)}
                        title={<String id="myCountry" />}
                    />
                    <Tab
                        number={otherCountriesCommunities()}
                        onClick={() => handleClickOnCountryFilter('othercountries', false)}
                        title={<String id="otherCountries" />}
                    />
                </TabList>
            </Tabs>
    );
};

export default CountryTabs;
