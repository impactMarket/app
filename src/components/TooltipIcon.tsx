import { Box, Card, Icon, colors } from '@impact-market/ui';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import styled from 'styled-components';

const Tooltip = styled.div<{ black?: boolean }>`
    left: ${(props) => (props.black ? '100%' : '50%')};
    margin-top: 0.5rem;
    max-width: 250px;
    position: absolute;
    top: ${(props) => (props.black ? '75%' : '150%')};
    transform: ${(props) =>
        props.black ? 'translateX(-100%)' : 'translateX(-50%)'};
    width: max-content;
    z-index: 1;

    .tooltip {
        background-color: ${(props) => props.black && '#0C111D'};
        padding: ${(props) => props.black && '0.5rem'};

        > div {
            color: ${(props) => (props.black ? 'white' : colors.g500)};
        }
    }

    ${(props) =>
        !props.black &&
        `
    .tooltip ::after {
        background-color: ${colors.n01};
        box-shadow: -0.1rem -0.1rem 0rem -0.08rem rgb(16 24 40 / 10%);
        content: '';
        height: 0.8rem;
        left: 50%;
        position: absolute;
        top: -0.3rem;
        transform: translateX(-50%) rotate(45deg);
        width: 0.8rem;
    }`}
`;

interface Props {
    black?: boolean;
    children: any;
    variables?: any;
}

const TooltipIcon: React.FC<Props> = (props) => {
    const { black, children, variables } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <Box
            ml={0.25}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            flex
            fLayout="center start"
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <Icon g500 icon="infoCircle" />
            {tooltipOpen && (
                <Tooltip black={black} className="tooltip">
                    <Card className="tooltip">
                        <RichText
                            content={children}
                            variables={variables}
                            medium={black}
                            // @ts-ignore
                            style={{ fontSize: black && '0.75rem' }}
                        />
                    </Card>
                </Tooltip>
            )}
        </Box>
    );
};

export default TooltipIcon;
