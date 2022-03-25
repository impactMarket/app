import { Box, GeneratedPropTypes } from '@impact-market/ui';
import { ImageFieldImage } from '@prismicio/types';
import Img from 'next/image';
import React from 'react';

const Image = (props: ImageFieldImage & GeneratedPropTypes) => {
    const { alt = '', dimensions, url, ...forwardProps } = props;

    if (!url) {
        console.log(`No url provided for the image: \n${props}`);

        return null;
    }

    return (
        <Box {...forwardProps}>
            <Img
                alt={alt}
                layout="responsive"
                objectFit="cover"
                src={url}
                {...dimensions}
            />
        </Box>
    );
};

export default Image;
