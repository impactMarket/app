import {
    Box,
    Button,
    CircledIcon,
    Col,
    ModalWrapper,
    Row,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm } from "react-hook-form";
import { gql, useQuery } from '@apollo/client';
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import { useYupValidationResolver, yup } from '../helpers/yup';
import Input from '../components/Input';
import Message from '../libs/Prismic/components/Message';
import React, { useEffect, useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

//  Get managers community from thegraph
const managersQuery = gql`
    query managersQuery($id: String!) {
        managerEntities(where: {id: $id state:0}) {
            id
        }
    }
`;

const AddManager = () => {
    const schema = yup.object().shape({
        address: yup.string().max(42),
    });

    const { handleClose, community } = useModal();
    const { t } = useTranslations();
    const [managerAddress, setManagerAddress] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { data, loading: dataIsLoading }: any = useQuery(managersQuery, {
        variables: { id: managerAddress?.toLowerCase() },
    })

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            address: ''
        },
        resolver: useYupValidationResolver(schema)
    });

    const { addManager } = useAmbassador();

    const onSubmit: SubmitHandler<any> = (submitData: { address?: string }) => setManagerAddress(submitData?.address);

    useEffect(() => {
        if (data?.managerEntities?.length === 0) {
            const addManagerFunc = async () => {
                try {
                    setIsLoading(true)
        
                    const { status } = await addManager(community?.id, managerAddress);

                    if(status) {
                        handleClose();

                        setManagerAddress(null)

                        setIsLoading(false)

                        toast.success(<Message id="managerAdded" />);
                    }
                    else {
                        toast.error(<Message id="errorOccurred" />);
                    }

                    return setIsLoading(false)
                }
                catch(e) {
                    //  Todo: get error name directly from backend to write a specific message (edward or benardo)
                    console.log(e);

                    toast.error(<Message id="errorOccurred" />);

                    return setIsLoading(false);
                }
            }

            addManagerFunc()
        }

        if (!!data?.managerEntities?.length) {
            //  Todo: delete console.log and change message to "user already in a community"
            console.log('User already in a community!');
            toast.error(<Message id="errorOccurred" />);
        }

    }, [data, community?.id])


    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <CircledIcon icon="flash" large />
            <RichText
                content={t('addManager')}
                large
                mt={1.25}
                semibold
            />
            <Message
                g500
                id="managerNotification"
                mt={0.5}
                small
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={1.25}>
                    <Input
                        control={control}
                        hint={errors?.address ? t('fieldRequired') : ''}
                        label={t('addManagerAddress')}
                        name="address"
                        rules={{ required: true }}
                        withError={!!errors?.address}
                    />
                </Box>
                <Row mt={1}>
                    <Col colSize={{ sm: 6, xs: 6 }}>
                        <Button disabled={isLoading} gray onClick={handleClose} type="button" w="100%">
                            <RichText
                                content={t('cancel')}
                            />
                        </Button>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }}>
                        <Button disabled={dataIsLoading} isLoading={isLoading} type="submit" w="100%">
                            <RichText
                                content= {t('addManager')}
                            />
                        </Button>
                    </Col>
                </Row>
            </form>
        </ModalWrapper>
    );
};

export default AddManager
