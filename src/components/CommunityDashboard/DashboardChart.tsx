import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, Text, colors } from '@impact-market/ui';
import { CustomTooltip } from './DashboardChartTooltip';
import React from 'react';

const chartDefaultHeight = 150;

const chartComponents = {
    bar: {
        Chart: BarChart,
        ChartItem: Bar,
        itemProps: {
            barSize: 4,
            fill: colors.p700,
            radius: [4, 4, 4, 4]
        },
        tooltipProps: {
            cursor: { fill: colors.g200, radius: [4, 4, 4, 4] }
        }
    },
    line: {
        Chart: LineChart,
        ChartItem: Line,
        itemProps: {
            dot: <></>,
            stroke: colors.p700,
            strokeWidth: 2,
            type: 'monotone'
        }
    }
} as any;

export const DashboardChart = ({thegraphData, prismicData, days}: any) => { 
    const { Chart, ChartItem, itemProps, tooltipProps } = chartComponents[prismicData?.chartType] || {}

    // Create array with tooltip, value and dayId
    const data = thegraphData?.map((data: any, key: number) => { 
        return ({
            // Transform dayId back to unix (dayId * 1000 * 86400)
            days: days[key] * 1000 * 86400,
            value: data
        })
    })

    return (
        <Card>
            <Text g500 small>
                {prismicData?.chartLabel}
            </Text>
            <Text bold extralarge fLayout="end start" inlineFlex>
                {!thegraphData.includes(undefined) ? 
                    // Add all values from array (transform the string ones to number) and, if there are decimals, only show 2 decimals
                    thegraphData.reduce((a: string, b: string) => (Math.round((parseFloat(a) + parseFloat(b)) * 100) / 100), 0) 
                : 0}
                <Text extrasmall g500 mb={0.15} ml={0.3}>
                    {prismicData?.currency && 'cUsd'}
                    {prismicData?.percentage && '%'}
                </Text>
            </Text>

            <ResponsiveContainer height={chartDefaultHeight} width="100%">
                <Chart data={data} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
                    <Tooltip {...tooltipProps} content={
                        <CustomTooltip prismicData={prismicData}/>
                    }/>
                    <ChartItem dataKey="value" {...itemProps} />
                </Chart>
            </ResponsiveContainer>
        </Card>      
    );
};