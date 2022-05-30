import { ProgressBar as BaseProgressBar, ProgressBarProps as BaseProgressBarProps, Col, Row } from '@impact-market/ui';
import React from 'react';

type ProgressBarProps = {
    label?: React.ReactNode;
    minValue?: number;
    state: Object;
    title?: React.ReactNode;
};

const ProgressBar: React.FC<ProgressBarProps & BaseProgressBarProps> = props => {
    const { label, minValue, state, title, progress } = props;
    const finalState = progress <= minValue ? { error: true } : { ...state };
        
    return (
        <>
            {(!!title || !!label) && 
                <Row fLayout="start center" margin={0} mb={0.5}>
                    <Col colSize={{ sm: !!label ? 6 : 12, xs: 12 }} padding={0}>
                        {title}
                    </Col>
                    {!!label &&
                        <Col colSize={{ sm: 6, xs: 12 }} mt={{ sm: 0, xs: 0.25 }} padding={0} tAlign={{ sm: 'right', xs: 'left' }}>
                            {label}
                        </Col>
                    }
                </Row>
            }
            <BaseProgressBar progress={progress} {...finalState} />
        </>
    );
};

export default ProgressBar;
