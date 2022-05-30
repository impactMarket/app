import dynamic from 'next/dynamic';

const modals = {
    addBeneficiary: dynamic(() => import('./AddBeneficiary'), { ssr: false }),
    addManager: dynamic(() => import('./AddManager'), { ssr: false }),
    communityRules: dynamic(() => import('./CommunityRules'), { ssr: false }),
    createStory: dynamic(() => import('./Stories/CreateStory'), { ssr: false }),
    deleteStory: dynamic(() => import('./Stories/DeleteStory'), { ssr: false }),
    openStory: dynamic(() => import('./Stories/OpenStory'), { ssr: false }),
    reportStory: dynamic(() => import('./Stories/ReportStory'), { ssr: false }),
    welcomeBeneficiary: dynamic(() => import('./WelcomeBeneficiary'), { ssr: false }),
    wrongNetwork: dynamic(() => import('./WrongNetwork'), { ssr: false })
}

export default modals;
