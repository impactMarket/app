import dynamic from 'next/dynamic';

const modals = {
    addBeneficiary: dynamic(() => import('./AddBeneficiary'), { ssr: false }),
    addManager: dynamic(() => import('./AddManager'), { ssr: false }),
    addNote: dynamic(() => import('./Microcredit/AddNote'), { ssr: false }),
    approveLoan: dynamic(() => import('./Microcredit/ApproveLoan'), {
        ssr: false
    }),
    communityEdited: dynamic(() => import('./AddCommunity/CommunityEdited'), {
        ssr: false
    }),
    communityRules: dynamic(() => import('./CommunityRules'), { ssr: false }),
    confirmAddCommunity: dynamic(() => import('./AddCommunity/ConfirmAdd'), {
        ssr: false
    }),
    contribute: dynamic(() => import('./Contribute'), { ssr: false }),
    createStory: dynamic(() => import('./Stories/CreateStory'), { ssr: false }),
    deleteStory: dynamic(() => import('./Stories/DeleteStory'), { ssr: false }),
    laeFailedLesson: dynamic(() => import('./LearnAndEarn/WrongAnswer'), {
        ssr: false
    }),
    laeSuccessLesson: dynamic(() => import('./LearnAndEarn/SuccessModal'), {
        ssr: false
    }),
    openStory: dynamic(() => import('./Stories/OpenStory'), { ssr: false }),
    previewFile: dynamic(() => import('./PreviewFile'), { ssr: false }),
    recoverAccount: dynamic(() => import('./RecoverAccount'), { ssr: false }),
    reloadInfoAddCommunity: dynamic(() => import('./AddCommunity/ReloadInfo'), {
        ssr: false
    }),
    removeCommunity: dynamic(() => import('./RemoveCommunity'), { ssr: false }),
    reportStory: dynamic(() => import('./Stories/ReportStory'), { ssr: false }),
    reportSuspiciousActivity: dynamic(
        () => import('./ReportSuspiciousActivity'),
        { ssr: false }
    ),
    signature: dynamic(() => import('./Signature'), { ssr: false }),
    welcomeBeneficiary: dynamic(() => import('./WelcomeBeneficiary'), {
        ssr: false
    }),
    wrongNetwork: dynamic(() => import('./WrongNetwork'), { ssr: false })
};

export default modals;
