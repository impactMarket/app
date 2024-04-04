import {
    Box,
    Card,
    CircledIcon,
    Display,
    ViewContainer
} from '@impact-market/ui';
import Message from 'src/libs/Prismic/components/Message';
import React from 'react';
import styled from 'styled-components';

const CardStyled = styled(Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 2rem;
`;

const CheckPermission = ({ title }: { title?: string }) => (
    <ViewContainer {...({} as any)}>
        {title && (
            <Display g900 medium mb={2}>
                {title}
            </Display>
        )}
        <CardStyled>
            <CircledIcon icon="forbidden" error medium />
            <Box>
                <Message id="noPermission" g900 large medium />
            </Box>
        </CardStyled>
    </ViewContainer>
);

export default CheckPermission;
