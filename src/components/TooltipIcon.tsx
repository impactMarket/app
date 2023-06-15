import { Box, Card, Icon } from '@impact-market/ui';
import React, { useState } from 'react';
import styled from 'styled-components';

import RichText from '../libs/Prismic/components/RichText';

const Tooltip = styled.div`
    left: 50%;
    margin-top: 0.5rem;
    max-width: 250px;
    position: absolute;
    top: 150%;
    transform: translateX(-50%);
    width: max-content;
    z-index: 1;

    .tooltip ::after {
        background-color: #ffffff;
        box-shadow: -0.1rem -0.1rem 0rem -0.08rem rgb(16 24 40 / 10%);
        content: '';
        height: 0.8rem;
        left: 50%;
        position: absolute;
        top: -0.3rem;
        transform: translateX(-50%) rotate(45deg);
        width: 0.8rem;
    }
`;

interface Props {
    children: any;
    variables?: any;
}

const TooltipIcon: React.FC<Props> = (props) => {
    const { children, variables } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);

    return (
        <Box
            ml={0.5}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            flex
            fLayout="center start"
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <Icon g500 icon="infoCircle" />
            {tooltipOpen && (
                <Tooltip>
                    <Card className="tooltip">
                        <RichText
                            content={children}
                            g500
                            variables={variables}
                        />
                    </Card>
                </Tooltip>
            )}
        </Box>
    );
};

export default TooltipIcon;
