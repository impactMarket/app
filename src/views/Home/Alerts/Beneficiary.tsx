import { Alert, Button, openModal } from '@impact-market/ui';
import {
    RequestFundsStatus,
    useBeneficiary
} from '@impact-market/utils/useBeneficiary';
import { gql, useQuery } from '@apollo/client';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Message from '../../../libs/Prismic/components/Message';
import React, { useEffect } from 'react';
import config from '../../../../config';
import useCommunity from '../../../hooks/useCommunity';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const fetcher = (url: string, headers: any | {}) =>
    fetch(config.baseApiUrl + url, headers).then((res) => res.json());

//  Get increment interval from thegraph
const communityQuery = gql`
    query communityQuery($id: String!) {
        communityEntity(id: $id) {
            incrementInterval
        }
    }
`;

const BeneficiaryAlerts = () => {
    const auth = useSelector(selectCurrentUser);
    const { t } = useTranslations();

    const { data: queryInterval } = useQuery(communityQuery, {
        variables: {
            id: auth?.user?.beneficiary?.community?.toLowerCase()
        }
    });

    const {
        isReady,
        beneficiary: {
            isClaimable,
            community: { requestFundsStatus }
        }
    } = useBeneficiary(auth?.user?.beneficiary?.community);

    const { community } = useCommunity(
        auth?.user?.beneficiary?.community,
        fetcher
    );

    // If the User hasn't already accepted the Community Rules, show the modal
    useEffect(() => {
        if (!auth?.user?.beneficiaryRules) {
            openModal('welcomeBeneficiary', {
                communityImage: community?.coverImage,
                communityName: community?.name
            });
        }
    }, []);

    const openUbi = () => (
        <Link href="/beneficiary" passHref>
            <Button icon="plus">{t('claimUbi')}</Button>
        </Link>
    );

    return (
        <>
            {isReady && (
                <>
                    {requestFundsStatus ===
                        RequestFundsStatus.NOT_ENOUGH_FUNDS &&
                        !auth?.user?.roles.includes('manager') && (
                            <Alert
                                error
                                icon="alertCircle"
                                mb={1}
                                message={
                                    <Message
                                        id="communityFundsHaveRunOut"
                                        medium
                                        small
                                    />
                                }
                            />
                        )}
                    {!auth?.user?.active && (
                        <Alert
                            error
                            icon="key"
                            mb={1}
                            message={
                                <Message
                                    id="yourAccountHasBeenLocked"
                                    medium
                                    small
                                />
                            }
                        />
                    )}
                    {isClaimable &&
                        requestFundsStatus === RequestFundsStatus.READY && (
                            <Alert
                                button={openUbi()}
                                icon="coinStack"
                                mb={1}
                                message={
                                    <Message
                                        id="claimUbiDescription"
                                        small
                                        g800
                                        variables={{
                                            time:
                                                queryInterval?.communityEntity
                                                    ?.incrementInterval / 12
                                        }}
                                    />
                                }
                                title={
                                    <Message id="claimUbi" medium small g800 />
                                }
                            />
                        )}
                </>
            )}
        </>
    );
};

export default BeneficiaryAlerts;
