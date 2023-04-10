import { Box, Card, Icon, Text } from '@impact-market/ui';
import { useState } from 'react';
import Tooltip from '../../components/Tooltip';
import styled from 'styled-components';

const CleanCard = styled(Card)`
    box-shadow: none;
    overflow: hidden;
    transition: max-height 0.5s;
    max-height: 3rem;
    margin-top: 2rem;

    &.active {
        max-height: 100rem;
        background-color: #f8f9fd;
    }
`;

const LoanOverview = (props: any) => {
    const { overviewData } = props;
    const [active, setActive] = useState(true);

    const handleClick = () => {
        const overviewElement = document.querySelector('.overview');

        if (active) {
            overviewElement.classList.remove('active');
            setActive(false);
        } else {
            overviewElement.classList.add('active');
            setActive(true);
        }
    };

    return (
        <CleanCard className="overview active">
            <a>
                <Box flex fLayout="center">
                    <div className="clicked-element" onClick={handleClick}>
                        <Text small p500 semibold>
                            {'Loan Overview'}
                        </Text>
                    </div>
                    <Icon icon={active ? 'chevronUp' : 'chevronDown'} p500 />
                </Box>
            </a>
            <Box mt={1}>
                {overviewData.map(({ label, highlight = false, value, tooltip }: any) => (
                    <Box flex fLayout="between" mb={0.5}>
                        <Box flex fLayout="center start">
                            <Text small g500 {...(highlight && { e500: true })}>
                                {label}
                            </Text>
                            <Tooltip content={tooltip}>
                                <Icon icon="infoCircle" g500 ml={0.3} />
                            </Tooltip>
                        </Box>

                        <Text small semibold g900>
                            {value}
                        </Text>
                    </Box>
                ))}
            </Box>
        </CleanCard>
    );
};

export default LoanOverview;
