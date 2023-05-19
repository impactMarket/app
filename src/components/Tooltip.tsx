import { colors } from '@impact-market/ui';
import Tippy from '@tippyjs/react';
import styled from 'styled-components';

import 'tippy.js/dist/tippy.css';

interface TooltipProps {
    children: any;
    content: string;
    disabledTooltip?: boolean;
}

const StyledTippy = styled(Tippy)`
    align-items: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 4px 24px 0px #00000033;
    color: ${colors.g500};
    display: flex;
    justify-content: center;
    padding: 0.5rem 0.75rem;

    .tippy-arrow {
        color: white;
    }
`;

const Tooltip = (props: TooltipProps) => {
    const { children, content, disabledTooltip = false } = props;

    return (
        <StyledTippy
            content={content}
            disabled={disabledTooltip}
            placement="bottom"
        >
            <div>{children}</div>
        </StyledTippy>
    );
};

export default Tooltip;
