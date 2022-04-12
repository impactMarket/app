import dynamic from 'next/dynamic';

const modals = {
    communityRules: dynamic(() => import('./CommunityRules'), { ssr: false }),
    welcomeBeneficiary: dynamic(() => import('./WelcomeBeneficiary'), { ssr: false })
}

export default modals;