import React from 'react';
import styled from 'styled-components';

const ShimmerEffect = ({ isLoading, children }: any) => {
    const ShimmerWrapper = styled.div`
        height: 30px;
        width: 20%;
        margin-top: 4px;
        margin-bottom: 4px;
        border-radius: 10px;
        background: #f0f2f7;
        background-image: linear-gradient(
            to right,
            #f0f2f7 0%,
            #fff 5%,
            #f0f2f7 40%,
            #f0f2f7 100%
        );
        background-repeat: no-repeat;
        background-size: 800px 104px;
        display: inline-block;
        position: relative;

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

    return isLoading ? <ShimmerWrapper /> : children;
};

export default ShimmerEffect;
