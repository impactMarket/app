import { Box } from '@impact-market/ui';
import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('../wallet'), {
    ssr: false
});

function Sidebar() {
    return (
        <>
            <Wallet />
            <Box padding="3">
                <Link href="/beneficiary">
                    <a>go beneficiary</a>
                </Link>
            </Box>
        </>
    );
}

export default Sidebar;
