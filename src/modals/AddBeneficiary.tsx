/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, CircledIcon, Col, ModalWrapper, Row, Text, toast, useModal } from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
// import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { selectCurrentUser } from '../state/slices/auth';
import { useManager } from '@impact-market/utils/useManager';
import { useSelector } from 'react-redux';
import { userManager } from '../utils/users';
import Input from '../components/Input';
import Message from '../libs/Prismic/components/Message';
import React from 'react';

const AddBeneficiary = () => {
    const { handleClose } = useModal();

    // TODO: load information from prismic and use it in the content
    // const { extractFromModals } = usePrismicData();
    // const { buttonLabel, content, items, title } = extractFromModals('communityRules') as any;

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            address: ''
        }
    });
    const { isSubmitting } = useFormState({ control });
    const auth = useSelector(selectCurrentUser);

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        handleClose();

        return null;
    }

    const { addBeneficiary } = useManager(
        auth?.user?.manager?.community
    );

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            /* 
            * TODO: was if an address was already added as beneficiary? 
            * Right now it's returning an error:
                code: -32603
                data: {code: 3, message: 'execution reverted: Community: NOT_MANAGER', data: '0x08c379a00000000000000000000000000000000000000000…4793a204e4f545f4d414e4147455200000000000000000000'}
                message: "Internal JSON-RPC error."
            */
           
            const { status } = await addBeneficiary(data?.address);
            
            if(status) {
                handleClose();

                toast.success("The Beneficiary has been successfully added!");
            }
            else {
                toast.error(<Message id="errorOccurred" />);
            }
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);
        }
    };

    // TODO: load texts from Prismic
    // TODO: missing "Suspicious Activity Detected" alert as per design

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="userPlus" info medium /> 
            <Text g900 large mt={1.25} semibold>
                Add beneficiary
            </Text>
            <Text g500 mt={0.5} small>
                You will be able to monitor all transactions and actions from this person as well blocking or removing if needed.
            </Text>
            <Box mt={1.25}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        control={control}
                        hint={errors?.address ? 'This field is required' : ''}
                        label="Beneficiary Valora Wallet Address"
                        name="address"
                        rules={{ required: true }}
                        withError={!!errors?.address}
                    />
                    <Row fLayout="between" margin={0} mt={2} w="100%">
                        <Col colSize={6} pl={0} pr={0.375}>
                            <Box flex h="100%">
                                <Button disabled={isSubmitting} gray onClick={handleClose} type="button" w="100%">
                                    Cancel
                                </Button>
                            </Box>
                        </Col>
                        <Col colSize={6} pl={0.375} pr={0}>
                            <Box flex h="100%">
                                <Button disabled={isSubmitting} isLoading={isSubmitting} type="submit" w="100%">
                                    Add Beneficiary
                                </Button>
                            </Box>
                        </Col>
                    </Row>
                </form>
            </Box>
        </ModalWrapper>
    )
}

export default AddBeneficiary;
