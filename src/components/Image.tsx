import { getImage } from '../utils/images';
import Img from 'next/image';
import React from 'react';

const Image = (props: any) => {
    const { src: filePath, ...forwardProps } = props;

    return (
        <Img
            alt=""
            blurDataURL={getImage({
                filePath,
                fit: 'cover',
                height: 2,
                width: 2
            })}
            height="100%"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            src={getImage({
                filePath,
                fit: 'cover',
                height: 0,
                width: 0
            })}
            width="100%"
            {...forwardProps}
        />
    );
};

export default Image;
