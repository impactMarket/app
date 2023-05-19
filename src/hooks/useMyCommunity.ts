import { useSelector } from 'react-redux';

import { selectCurrentUser } from '../state/slices/auth';
import config from '../../config';
import useCommunities from './useCommunities';
import useCommunity from './useCommunity';

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

export default function useMyCommunity() {
    const { user } = useSelector(selectCurrentUser);

    const filters = {
        limit: 999,
        review: 'pending'
    };

    //  Pending Manager / Community
    const { communities } = useCommunities(filters, fetcher);

    const pendingCommunity = communities?.data?.rows?.filter(
        (community: { requestByAddress: string }) =>
            community?.requestByAddress === user?.address
    )[0];

    //  Community already accepted
    const { community } = useCommunity(
        user?.manager
            ? user?.manager?.community
            : user?.beneficiary && user?.beneficiary?.community,
        fetcher
    );

    let path: string;

    if (user?.roles?.includes('pendingManager') && pendingCommunity) {
        path = `/communities/${pendingCommunity?.id}`;
    } else {
        path = community?.id
            ? `/communities/${community?.id}`
            : '/communities?type=all';
    }

    return { path };
}
