/* eslint-disable react-hooks/rules-of-hooks */
import { Button, toast } from '@impact-market/ui';
import { useManager } from '@impact-market/utils';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from 'react';

const StateButtons: React.FC<{ beneficiary: any, community: string }> = props => {
    const { beneficiary, community } = props;

    const [loadingBlockButton, setLoadingBlockButton] = useState(false);
    const [loadingRemoveButton, setLoadingRemoveButton] = useState(false);
    const [userState, setUserState] = useState(beneficiary?.beneficiary?.state);

    const { lockBeneficiary, removeBeneficiary, unlockBeneficiary } = useManager(community);

    const blockUser = async () => {
        try {
            setLoadingBlockButton(true);

            const { status } = await lockBeneficiary(beneficiary.address);

            if(status) {
                // TODO: add texts to Prismic
                toast.success('The Beneficiary was blocked successfully!');

                // User is now "locked"
                setUserState(2);
            }

            setLoadingBlockButton(false);
        }
        catch(error) {
            console.log(error);

            setLoadingBlockButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    }

    const unblockUser = async () => {
        try {
            setLoadingBlockButton(true);

            const { status } = await unlockBeneficiary(beneficiary.address);

            if(status) {
                // TODO: add texts to Prismic
                toast.success('The Beneficiary was unblocked successfully!');

                // User is now "active"
                setUserState(0);
            }

            setLoadingBlockButton(false);
        }
        catch(error) {
            console.log(error);

            setLoadingBlockButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    }

    const removeUser = async () => {
        try {
            setLoadingRemoveButton(true);

            const { status } = await removeBeneficiary(beneficiary.address);

            // TODO: after removing a user, should we return to beneficiaries list?
            if(status) {
                // TODO: add texts to Prismic
                toast.success('The Beneficiary was removed successfully!');

                // User is now "removed"
                setUserState(1);
            }

            setLoadingRemoveButton(false);
        }
        catch(error) {
            console.log(error);

            setLoadingRemoveButton(false);

            toast.error(<Message id="errorOccurred" />);
        }
    }

    // TODO: add texts to Prismic
    // TODO: what happens if a user is already "Removed"? Do we show any information? Just disable the remove button?

    return (
        <>
            {
                userState === 0 &&
                <Button disabled={loadingBlockButton || loadingRemoveButton} icon="userCross" isLoading={loadingBlockButton} mr={1} onClick={blockUser} secondary>
                    Block
                </Button>
            }
            {
                userState === 2 &&
                <Button disabled={loadingBlockButton || loadingRemoveButton} icon="userCheck" isLoading={loadingBlockButton} mr={1} onClick={unblockUser} secondary>
                    Unblock
                </Button>
            }
            <Button disabled={userState === 1 || loadingRemoveButton || loadingBlockButton} icon="userMinus" isLoading={loadingRemoveButton} onClick={removeUser}>
                Remove Beneficiary
            </Button>
        </>
    );
};

export default StateButtons;
