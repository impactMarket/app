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
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            src={getImage({
                filePath,
                fit: 'cover',
                height: 0,
                width: 0
            })}
            {...forwardProps}
        />
    );
};

export default Image;
