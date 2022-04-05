import dynamic from 'next/dynamic';

const modals = {
    addBeneficiary: dynamic(() => import('./AddBeneficiary'), { ssr: false }),
    addCommunity: dynamic(() => import('./AddCommunity'), { ssr: false }),
    communityRules: dynamic(() => import('./CommunityRules'), { ssr: false })
}

export default modals;