/* eslint-disable react-hooks/rules-of-hooks */
import { Button, toast } from '@impact-market/ui';
import { handleKnownErrors } from '../../helpers/handleKnownErrors';
import { useManager } from '@impact-market/utils';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';
import String from '../../libs/Prismic/components/String';
import processTransactionError from '../../utils/processTransactionError';

const StateButtons: React.FC<{ beneficiary: any; community: string }> = (
    props
) => {
    const { beneficiary, community } = props;

    const [loadingBlockButton, setLoadingBlockButton] = useState(false);
    const [loadingRemoveButton, setLoadingRemoveButton] = useState(false);
    const [userState, setUserState] = useState(beneficiary?.beneficiary?.state);

    const { lockBeneficiary, removeBeneficiary, unlockBeneficiary } =
        useManager(community);

    const blockUser = async () => {
        try {
            setLoadingBlockButton(true);

            toast.info(<Message id="approveTransaction" />);
            const { status } = await lockBeneficiary(beneficiary.address);

            if (status) {
                toast.success(<Message id="beneficiaryBlocked" />);

                // User is now "locked"
                setUserState(2);
            }

            setLoadingBlockButton(false);
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'block_beneficiary');

            setLoadingBlockButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    const unblockUser = async () => {
        try {
            setLoadingBlockButton(true);

            toast.info(<Message id="approveTransaction" />);
            const { status } = await unlockBeneficiary(beneficiary.address);

            if (status) {
                toast.success(<Message id="beneficiaryUnblocked" />);

                // User is now "active"
                setUserState(0);
            }

            setLoadingBlockButton(false);
        } catch (error) {
            console.log(error);
            processTransactionError(error, 'unblock_beneficiary');

            setLoadingBlockButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    const removeUser = async () => {
        try {
            setLoadingRemoveButton(true);

            toast.info(<Message id="approveTransaction" />);
            const { status } = await removeBeneficiary(beneficiary.address);

            if (status) {
                toast.success(<Message id="beneficiaryRemove" />);

                // User is now "removed"
                setUserState(1);
            }

            setLoadingRemoveButton(false);
        } catch (error) {
            handleKnownErrors(error);
            processTransactionError(error, 'remove_beneficiary');

            setLoadingRemoveButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    // TODO: what happens if a user is already "Removed"? Do we show any information? Just disable the remove button?

    return (
        <>
            {userState === 0 && (
                <Button
                    disabled={loadingBlockButton || loadingRemoveButton}
                    icon="userCross"
                    isLoading={loadingBlockButton}
                    mr={1}
                    onClick={blockUser}
                    secondary
                >
                    <String id="block" />
                </Button>
            )}
            {userState === 2 && (
                <Button
                    disabled={loadingBlockButton || loadingRemoveButton}
                    icon="userCheck"
                    isLoading={loadingBlockButton}
                    mr={1}
                    onClick={unblockUser}
                    secondary
                >
                    <String id="unblock" />
                </Button>
            )}
            <Button
                disabled={
                    userState === 1 || loadingRemoveButton || loadingBlockButton
                }
                icon="userMinus"
                isLoading={loadingRemoveButton}
                onClick={removeUser}
            >
                <String id="removeBeneficiary" />
            </Button>
        </>
    );
};

export default StateButtons;
