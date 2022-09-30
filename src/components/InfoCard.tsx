import { Box, Card, Icon, PulseIcon, Text } from '@impact-market/ui';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React, { useState } from 'react';
import styled from 'styled-components';

import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

const Tooltip = styled.div`
    left: 50%;
    margin-top: 0.5rem;
    max-width: 250px;
    position: absolute;
    text-align: center;
    top: 150%;
    transform: translateX(-50%);
    width: max-content;
    z-index: 1;

    .tooltip ::after{
        background-color: #ffffff;
        box-shadow: -0.1rem -0.1rem 0rem -0.08rem rgb(16 24 40 / 10%);
        content: "";
        height: 0.8rem;
        left: 50%;
        position: absolute;
        top: -0.3rem;
        transform: translateX(-50%) rotate(45deg);
        width: 0.8rem;
    }
`

interface Props {
    label: string;
    icon: string;
    text: string;
    tooltip?: string;
}

const InfoCard: React.FC<Props> = (props) => {
    const { label, icon, text, tooltip } = props;
    const { view } = usePrismicData();
    const [tooltipOpen, setTooltipOpen] = useState(false)

    return (
        <Card flex h="100%">
            <Box fDirection="column" fLayout="between" flex w="100%">
                <Box fLayout="center start" inlineFlex mb={0.3} >
                    <Box>
                        <Text g500 regular small>
                            <String id={label} />
                        </Text>
                    </Box>
                    {tooltip &&
                        <Box ml={0.5} onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)} style={{cursor:'pointer', position:'relative'}}>
                            <Icon
                                g500
                                icon="infoCircle"
                            />
                            {tooltipOpen &&
                                <Tooltip>
                                    <Card className="tooltip">
                                        <RichText
                                            content={view.data.messageDecreaseStep}
                                            g700
                                            variables={{ value: tooltip }}
                                        />
                                    </Card>
                                </Tooltip>
                                
                            }
                        </Box>
                    }         
                </Box>
                <Box fLayout="end between" flex>
                    <Box>
                        <Text g900 medium semibold>
                            {text}
                        </Text>
                    </Box>
                    <Box right>
                        <PulseIcon
                            bgS100
                            borderColor="s50"
                            icon={icon}
                            s600
                            size={2}
                        />
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default InfoCard;
