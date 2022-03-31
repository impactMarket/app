import { Display, ViewContainer } from '@impact-market/ui';
import { useRouter } from 'next/router';
import React from 'react';

const Home: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    const router = useRouter();

    return (
        <ViewContainer isLoading={isLoading}>
            <Display>
                Welcome home
            </Display>
            <br /><br />
            <div onClick={() => router.push('/test1')}>Go to Test1</div>
            <br /><br />
            <div onClick={() => router.push('/test2')}>Go to Test2</div>
        </ViewContainer>
    );
};

export default Home;