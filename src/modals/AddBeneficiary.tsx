/* eslint-disable react-hooks/rules-of-hooks */
import { Alert, Box, Button, CircledIcon, Col, ModalWrapper, Row, Text, toast, useModal } from '@impact-market/ui';
import { SubmitHandler, useForm } from "react-hook-form";
import { gql, useQuery } from '@apollo/client';
import { selectCurrentUser } from '../state/slices/auth';
import { useManager } from '@impact-market/utils/useManager';
import { useSelector } from 'react-redux';
import { useYupValidationResolver, yup } from '../helpers/yup';
import { userManager } from '../utils/users';
import Input from '../components/Input';
import Message from '../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import String from '../libs/Prismic/components/String';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

//  Get managers community from thegraph
const beneficiariesQuery = gql`
    query beneficiariesQuery($id: String!) {
        beneficiaryEntities(where: {id: $id state:0}) {
            id
        }
    }
`;

const AddBeneficiary = () => {
    const schema = yup.object().shape({
        address: yup.string().max(42),
    });
    
    const auth = useSelector(selectCurrentUser);
    const { handleClose } = useModal();
    const { t } = useTranslations();
    const [beneficiaryAddress, setBeneficiaryAddress] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState({
        description: '',
        state: false,
        title: ''
    })

    const { data, loading: dataIsLoading }: any = useQuery(beneficiariesQuery, {
        variables: { id: beneficiaryAddress?.toLowerCase() },
    })

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            address: ''
        },
        resolver: useYupValidationResolver(schema)
    });

    // Check if current User has access to this page
    if(!auth?.type?.includes(userManager)) {
        handleClose();

        return null;
    }

    const { canUsersBeBeneficiaries } = useManager(auth?.user?.manager?.community);
    const { addBeneficiary } = useManager(auth?.user?.manager?.community);

    const onSubmit: SubmitHandler<any> = (submitData: { address?: string }) => setBeneficiaryAddress(submitData?.address);

    useEffect(() => {
        if (data?.beneficiaryEntities?.length === 0) {
            const addManagerFunc = async () => {
                try {
                    setIsLoading(true)

                    //  Todo: prismic texts for error messages
                    setError({
                        description: '',
                        state: false,
                        title:''
                    })

                    //  Check if user can be Beneficiary
                    await canUsersBeBeneficiaries([beneficiaryAddress])
                        .then( async () => {
                            const { status } = await addBeneficiary(beneficiaryAddress);

                            if(status) {
                                handleClose();
        
                                setBeneficiaryAddress(null)
        
                                setIsLoading(false)
        
                                toast.success(<Message id="beneficiaryAdded" />);
                            }
                            else {
                                setError({
                                    description: 'Please try again later.',
                                    state: true,
                                    title:'Oops! Something went wrong'
                                })
                            }
        
                            return setIsLoading(false)

                        }).catch((e) => {
                            console.log(e)

                            setError({
                                description: "Please enter a valid Valora Wallet Address.",
                                state: true,
                                title:"User not found."
                            })

                            return setIsLoading(false)
                        })

                    return setIsLoading(false)
                }
                catch(e) {
                    console.log(e);

                    setError({
                        description: 'Please try again later.',
                        state: true,
                        title:'Oops! Something went wrong'
                    })

                    return setIsLoading(false);
                }
            }

            addManagerFunc()
        }

        if (!!data?.beneficiaryEntities?.length) {
            setError({
                description: 'This beneficiary is already in a community. You can only add beneficiaries with no communities.',
                state: true,
                title:'Beneficiary already in a community'
            })
        }

    }, [data])

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
                    {error?.state &&
                        //  Todo: add alert texts on prismic
                        <Row margin={0} mt={1} w="100%">
                            <Alert
                                error
                                icon="alertCircle"
                                message={error?.description}
                                title={error?.title}
                            />
                        </Row>
                    }                    
                    <Row fLayout="between" margin={0} mt={1} w="100%">
                        <Col colSize={6} pl={0} pr={0.375}>
                            <Box flex h="100%">
                                <Button disabled={isLoading} gray onClick={handleClose} type="button" w="100%">
                                    <String id="cancel" />
                                </Button>
                            </Box>
                        </Col>
                        <Col colSize={6} pl={0.375} pr={0}>
                            <Box flex h="100%">
                                <Button disabled={dataIsLoading} isLoading={isLoading} type="submit" w="100%">
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
