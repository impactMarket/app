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
import String from '../libs/Prismic/components/String';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const AddBeneficiary = () => {
    const { handleClose, onAddBeneficiary } = useModal();

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
    const { t } = useTranslations();

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


                code: -32603
                data:
                code: 3
                data: "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002d436f6d6d756e6974793a3a61646442656e65666963696172793a2042656e65666963696172792065786973747300000000000000000000000000000000000000"
                message: "execution reverted: Community::addBeneficiary: Beneficiary exists"
                [[Prototype]]: Object
                message: "Internal JSON-RPC error."

                Check if message contains "Beneficiary exists" to show the toaster
            */
           
            const { status } = await addBeneficiary(data?.address);
            
            if(status) {
                handleClose();
                onAddBeneficiary();

                toast.success(<Message id="beneficiaryAdded" />);
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

    // TODO: missing "Suspicious Activity Detected" alert as per design

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="userPlus" info medium /> 
            <Text g900 large mt={1.25} semibold>
                <String id="addBeneficiary" />
            </Text>
            <Message g500 id="monitorAllTransactions" mt={0.5} small />
            <Box mt={1.25}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        control={control}
                        hint={errors?.address ? t('requiredField') : ''}
                        label={t('beneficiaryValoraWalletAddress')}
                        name="address"
                        rules={{ required: true }}
                        withError={!!errors?.address}
                    />
                    <Row fLayout="between" margin={0} mt={2} w="100%">
                        <Col colSize={6} pl={0} pr={0.375}>
                            <Box flex h="100%">
                                <Button disabled={isSubmitting} gray onClick={handleClose} type="button" w="100%">
                                    <String id="cancel" />
                                </Button>
                            </Box>
                        </Col>
                        <Col colSize={6} pl={0.375} pr={0}>
                            <Box flex h="100%">
                                <Button disabled={isSubmitting} isLoading={isSubmitting} type="submit" w="100%">
                                    <String id="addBeneficiary" />
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
