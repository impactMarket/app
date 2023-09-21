import { Tab, TabList, Tabs } from '@impact-market/ui';
import React from 'react';
import styled from 'styled-components';

export type TabItem = {
    title: string;
    number?: number;
    onClick: () => void;
};

type FlexibleTabProps = {
    tabs: TabItem[];
    index?: number;
};

const TabListStyled = styled(TabList)`
    ul {
        overflow-x: scroll;
        overflow-y: hidden;
        white-space: nowrap;

        li::after {
            bottom: 0 !important;
        }
    }
`;

const FlexibleTab: React.FC<FlexibleTabProps> = ({ tabs, index }) => {
    return (
        <Tabs defaultIndex={index}>
            {/* @ts-ignore */}
            <TabListStyled>
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        title={tab.title}
                        number={tab.number}
                        onClick={tab.onClick}
                    />
                ))}
            </TabListStyled>
        </Tabs>
    );
};

export { FlexibleTab };
