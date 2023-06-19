import { Tab, TabList, Tabs } from '@impact-market/ui';
import React from 'react';

export type TabItem = {
    title: string;
    number?: number;
    onClick: () => void;
};

type FlexibleTabProps = {
    tabs: TabItem[];
};

const FlexibleTab: React.FC<FlexibleTabProps> = ({ tabs }) => {
    return (
        <Tabs>
            <TabList>
                {tabs.map((tab, index) => (
                        <Tab key={index} title={tab.title} number={(tab.number > 0) ? tab.number : null} onClick={tab.onClick}/>
                ))}
            </TabList>
        </Tabs>
    );
};

export { FlexibleTab };
