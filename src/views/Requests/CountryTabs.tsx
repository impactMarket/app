import React from 'react';

import {
    Tab,
    TabList,
    Tabs,
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';


const CountryTabs = ({ userCountry, allCountries, otherCountries, setMyCountrySelected }: any) => {   

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


    return (
            <Tabs>
                <TabList>
                    <Tab
                        number={myCountryCommunities()}
                        onClick={() => setMyCountrySelected(true)}
                        title={<String id="myCountry" />}
                    />
                    <Tab
                        number={otherCountriesCommunities()}
                        onClick={() => setMyCountrySelected(false)}
                        title={<String id="otherCountries" />}
                    />
                </TabList>
            </Tabs>
    );
};

export default CountryTabs;
