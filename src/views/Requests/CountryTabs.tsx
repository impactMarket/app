import React from 'react';

import {
    Tab,
    TabList,
    Tabs,
} from '@impact-market/ui';

import String from '../../libs/Prismic/components/String';


const CountryTabs = ({ setMyCountrySelected, reviewsByCountry, userCountry } : any) => {    
    
    const myCountryNumberOfCommunities = () => {
        let numberOfCommunities = 0 as number

        !!Object.keys(reviewsByCountry).length && (
            reviewsByCountry.filter((countryName: any) => countryName.country === userCountry).map((country: any) => {
                numberOfCommunities = parseInt(country.count, 10)
            }
        ))

        return numberOfCommunities
    }

    const otherCountriesNumberOfCommunities = () => {
        const numberOfCommunitiesArray = [] as any
        const numberOfAcceptedCommunitiesArray = [] as any

        !!Object.keys(reviewsByCountry).length && (
            reviewsByCountry.map((country: any) => {
                numberOfCommunitiesArray.push(parseInt(country.count, 10)) 
                numberOfAcceptedCommunitiesArray.push(parseInt(country.accepted, 10))   
            })
        )

        const numberOfCommunitiesCalc = numberOfCommunitiesArray.reduce((a: number, b: number) => a + b, 0) - numberOfAcceptedCommunitiesArray.reduce((a: number, b: number) => a + b, 0)

        return numberOfCommunitiesCalc
    }


    return (
            <Tabs>
                <TabList>
                    <Tab
                        number={myCountryNumberOfCommunities()}
                        onClick={() => setMyCountrySelected(true)}
                        title={<String id="myCountry" />}
                    />
                    <Tab
                        number={otherCountriesNumberOfCommunities()}
                        onClick={() => setMyCountrySelected(false)}
                        title={<String id="otherCountries" />}
                    />
                </TabList>
            </Tabs>
    );
};

export default CountryTabs;
