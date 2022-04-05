import { Box, Button, CircledIcon, Col, ModalWrapper, Row, Text, useModal } from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import React from 'react';

type Inputs = {
    address: string
};

const AddBeneficiary = () => {
    const { handleClose } = useModal();

    // TODO: load information from prismic and use it in the content
    // const { extractFromModals } = usePrismicData();
    // const { buttonLabel, content, items, title } = extractFromModals('communityRules') as any;

    const { control, register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { isSubmitting } = useFormState({ control });

    // TODO: finish submit function
    const onSubmit: SubmitHandler<any> = (data) => {
        try {
            console.log('add beneficiary', data);

            handleClose();
        }
        catch(e) {
            console.log(e);
        }
    };

    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            { /* TODO: Fix icon size in UI (needs new option) AND replace by correct icon */ }
            <CircledIcon icon="plusCircle" info large /> 
            <Text g900 large mt={1.25} semibold>
                Add beneficiary
            </Text>
            <Text g500 mt={0.5} small>
                You will be able to monitor all transactions and actions from this person as well blocking or removing if needed.
            </Text>
            <Box mt={1.25}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="address">Beneficiary Valora Wallet Address</label>
                    <br />
                    <input id="address" {...register("address", { required: true })} style={{ border: '1px solid black' }} />
                    <br />
                    {errors.address && <span>This field is required</span>}
                    <br />

                    <Row fLayout="between" margin={0} w="100%">
                        <Col colSize={6} pl={0} pr={0.375}>
                            <Button disabled={isSubmitting} fluid="md" gray onClick={handleClose} type="button" w="100%">
                                Cancel
                            </Button>
                        </Col>
                        <Col colSize={6} pl={0.375} pr={0}>
                            <Button fluid="md" isLoading={isSubmitting} type="submit" w="100%">
                                Add Beneficiary
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Box>
        </ModalWrapper>
    )
}

export default AddBeneficiary;
