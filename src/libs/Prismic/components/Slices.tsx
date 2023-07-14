import { Slice } from '@prismicio/types';
import React, { ComponentType } from 'react';
import componentCase from '../helpers/componentCase';
import sliceComponents from '../../../../prismic-slices/slices';

type SlicesProps = {
    components?: { [componentName: string]: ComponentType | Function };
    slices: Slice[];
};

const Slices = (props: SlicesProps) => {
    const { components = {}, slices } = props;

    return (
        <>
            {slices.map((slice, index) => {
                const SliceComponent =
                    components[componentCase(slice.slice_type)] ||
                    sliceComponents[componentCase(slice.slice_type)];

                if (!SliceComponent) {
                    console.log(
                        `No slice component found for ${slice.slice_type}`
                    );

                    return null;
                }

                const Component = SliceComponent as React.ComponentType<Slice>;

                return <Component key={index} {...slice} />;
            })}
        </>
    );
};

export default Slices;
