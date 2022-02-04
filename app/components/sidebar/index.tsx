import Link from 'next/link';
import dynamic from 'next/dynamic';

const Wallet = dynamic(() => import('../wallet'), {
    ssr: false
});

function Sidebar() {
    return (
        <>
            <Wallet />
            <Link href="/beneficiary">
                <a>go beneficiary</a>
            </Link>
        </>
    );
}

export default Sidebar;
