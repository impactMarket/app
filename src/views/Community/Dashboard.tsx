import { Box, Display, Grid, Text } from '@impact-market/ui';
import { DashboardChart } from '../../components/CommunityDashboard/DashboardChart';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';

const emptyDailyEntities = {
    __typename: '',
    beneficiaries: 0,
    claimed: 0,
    claims: 0,
    contributions: 0,
    contributors: 0,
    dayId: 0,
    fundingRate: 0,
    reach: 0,
    transactions: 0,
    volume: 0
};

const Dashboard = ({ data: thegraphData, daysInterval }: any) => {
    const { extractFromView } = usePrismicData();

    const {
        heading: prismicHeading,
        rows: prismicData,
        text: prismicText
    } = extractFromView('dashboard') as any;

    // Add days to emptyDailyEntities
    const emptyDailyEntitiesWithDays: any[] = [];

    for (let index = 0; index < daysInterval; index++) {
        emptyDailyEntitiesWithDays.push({
            ...emptyDailyEntities,
            dayId:
                Math.floor(new Date().getTime() / 1000 / 86400) -
                daysInterval +
                index
        });
    }

    // Add empty dailyEntities when days don't have data (thegraph only sends data the day a change ocurs)
    const newThegraphData = () => {
        const dayArray = thegraphData?.map((data: any) => {
            return data?.dayId;
        });

        const emptyDays = [];

        let i = 0;
        let x = 0;

        for (let index = 0; index < daysInterval; index++) {
            const dayId =
                Math.floor(new Date().getTime() / 1000 / 86400) -
                daysInterval +
                index;

            if (dayArray?.includes(dayId)) {
                emptyDays.push(thegraphData[i]);
                i++;
                x++;
            } else {
                emptyDays.push(emptyDailyEntitiesWithDays[x]);
                x++;
            }
        }

        return emptyDays;
    };

    // Create array for each item (beneficiary, claims, etc)
    const itemArray = (helper: string) => {
        const itemArray = newThegraphData()?.map((data: any) => {
            return data[helper];
        });

        return itemArray;
    };

    // Create array for each day
    const dayArray = () => {
        const dayArray = newThegraphData()?.map((data: any) => {
            return data?.dayId;
        });

        return dayArray;
    };

    return (
        <>
            {/* Main Title and Description*/}
            <Box mt={4}>
                <Display semibold>{prismicHeading}</Display>
                {!!prismicText?.length && <RichText content={prismicText} />}
            </Box>

            <Box mt={2}>
                {/* Rows: Distribution, Fundraising, etc */}
                {prismicData?.map(
                    (
                        row: {
                            primary: { heading: string; text: string };
                            items: any[];
                        },
                        rowIndex: React.Key
                    ) => (
                        <Box key={rowIndex} mt={rowIndex && 3}>
                            <Text extralarge semibold>
                                {row?.primary?.heading}
                            </Text>

                            {!!row?.primary?.text?.length && (
                                <RichText
                                    content={row?.primary?.text}
                                    g600
                                    mt={0.5}
                                />
                            )}

                            <Grid cols={{ md: 3, xs: 1 }} mt={1}>
                                {/* Each Chart */}
                                {row?.items?.map((item, chartKey) => (
                                    <Box key={chartKey}>
                                        <DashboardChart
                                            days={dayArray()}
                                            prismicData={item}
                                            thegraphData={itemArray(
                                                item.chartHelper
                                            )}
                                        />
                                    </Box>
                                ))}
                            </Grid>
                        </Box>
                    )
                )}
            </Box>
        </>
    );
};

export default Dashboard;
