import { colors } from '@impact-market/ui';
import React from 'react';
import styled from 'styled-components';

const ShimmerWrapper = styled.div`
    background: ${colors.p25};
    background-image: linear-gradient(
        to right,
        ${colors.p25} 0%,
        #fff 5%,
        ${colors.p25} 40%,
        ${colors.p25} 100%
    );
    background-repeat: no-repeat;
    background-size: 800px 500px;
    border-radius: 10px;
    display: inline-block;
    height: 100%;
    margin-bottom: 3px;
    margin-top: 3px;
    position: relative;
    width: 100%;

    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeholderShimmer;
    animation-timing-function: linear;

    @keyframes placeholderShimmer {
        0% {
            background-position: -468px 0;
        }

        100% {
            background-position: 468px 0;
        }
    }
`;

const ShimmerEffect = ({ isLoading, children, style }: any) => {
    return isLoading ? <ShimmerWrapper style={style} /> : children;
};

export default ShimmerEffect;
