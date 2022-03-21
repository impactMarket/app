import { Display, ViewContainer } from '@impact-market/ui';
import React from 'react';

const Home: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>
                Welcome home
            </Display>
        </ViewContainer>
    );
};

export default Home;