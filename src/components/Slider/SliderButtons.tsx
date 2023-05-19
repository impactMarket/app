import { Icon, Text, colors } from '@impact-market/ui';
import React from 'react';
import styled from 'styled-components';

const StyledArrows = styled.div`
    .embla__arrow {
        background-color: ${colors.n01};
        border-radius: 8px;
        border: 1px solid ${colors.g300};
        box-shadow: 0px 1px 2px rgb(16 24 40 / 5%);
        cursor: pointer;
        padding: 0.5rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        :disabled {
            cursor: unset;
            opacity: 0.3;
        }
    }
    .embla__next {
        right: 1rem;
    }
    .embla__prev {
        left: 1rem;
    }
`;

const StyledPagination = styled.div`
    background-color: ${colors.n01};
    border-radius: 16px;
    bottom: 0;
    margin: 0 1rem 1rem 0;
    padding: 0.2rem 0.3rem;
    position: absolute;
    right: 0;
`;

export const PrevButton = ({ enabled, onClick }: any) => (
    <StyledArrows>
        <button
            className="embla__prev embla__arrow"
            disabled={!enabled}
            onClick={onClick}
        >
            <Icon g700 icon="arrowLeft" />
        </button>
    </StyledArrows>
);

export const NextButton = ({ enabled, onClick }: any) => (
    <StyledArrows>
        <button
            className="embla__next embla__arrow"
            disabled={!enabled}
            onClick={onClick}
        >
            <Icon g700 icon="arrowRight" />
        </button>
    </StyledArrows>
);

export const Pagination = ({ currentSlide, slidesLength }: any) => (
    <StyledPagination>
        <Text extrasmall semibold>
            {' '}
            {currentSlide} / {slidesLength}{' '}
        </Text>
    </StyledPagination>
);
