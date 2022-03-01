import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const slices = {
    SideMenuItem: dynamic(() => import('./SideMenuItem'), { ssr: false })
} as { [componentName: string]: ComponentType | Function };

export default slices;
