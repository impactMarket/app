import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const bars = new Array(8).fill('');

const fade = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0.25;
  }
`;

const SpinnerWrapper = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    height: 3rem;
    width: 3rem;

    svg {
        animation: ${fade} 1s linear infinite;
        border-radius: 0.625rem;
        fill: currentcolor;
        height: 33.33%;
        opacity: 0;
        position: absolute;
        width: 10%;

        ${bars.map(
            (_, index) => css`
                &:nth-child(${index + 1}) {
                    transform: rotate(${(index + 1) * 45}deg) translate(0, 100%);
                    animation-delay: ${-(1 - (index + 1) * 0.125)}s;
                }
            `
        )}
    }
`;

const Loader = props => {
    return (
        <SpinnerWrapper {...props} className="spinner">
            {bars.map((_, index) => (
                <svg key={index} viewBox="0 0 10 33.33">
                    <rect height="33.33" rx="5" ry="5" width="10" x="0" y="0" />
                </svg>
            ))}
        </SpinnerWrapper>
    );
};

export default Loader;
