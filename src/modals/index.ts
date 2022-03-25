import dynamic from 'next/dynamic';

const modals = {
    communityRules: dynamic(() => import('./CommunityRules'), { ssr: false })
}

export default modals;