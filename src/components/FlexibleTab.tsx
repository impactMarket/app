import { Tab, TabList, Tabs } from '@impact-market/ui';
import React from 'react';

export type TabItem = {
    title: string;
    number?: number;
    onClick: () => void;
};

type FlexibleTabProps = {
    tabs: TabItem[];
    index?: number;
};

const FlexibleTab: React.FC<FlexibleTabProps> = ({ tabs, index }) => {
    return (
        <Tabs defaultIndex={index}>
            <TabList>
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        title={tab.title}
                        number={tab.number}
                        onClick={tab.onClick}
                    />
                ))}
            </TabList>
        </Tabs>
    );
};

export { FlexibleTab };
