import { Box } from '@impact-market/ui';
import Image from 'next/image';
import React from 'react';

const NextImage = (props: any) => {

    if (!props.src) {
        console.log(`No url provided for the image: \n${props.src}`);

        return null;
    }

    return (
        <Box>
            <Image
                alt={props.alt ? props.alt : ''}
                height={props.height ? props.height : '100%'}
                layout="responsive"
                objectFit="cover"
                src={props.src}
                width={props.width ? props.width : '100%'}
            />
        </Box>
    );
};

export default NextImage;