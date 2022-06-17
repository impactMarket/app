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
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { useAmbassador } from '@impact-market/utils/useAmbassador';
import Input from '../components/Input';
import Message from '../libs/Prismic/components/Message';
import React from 'react';
import RichText from '../libs/Prismic/components/RichText';
import useTranslations from '../libs/Prismic/hooks/useTranslations';


const AddManager = () => {
    const { handleClose, community, setRefreshingPage } = useModal();
    const { t } = useTranslations();

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            address: ''
        }
    });
    const { isSubmitting } = useFormState({ control });

    const { addManager } = useAmbassador();
    
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            setRefreshingPage(true)

            const { status } = await addManager(community?.id, data?.address);

            if(status) {
                handleClose();

                toast.success(<Message id="managerAdded" />);
            }
            else {
                toast.error(<Message id="errorOccurred" />);
            }
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);
        }

        setRefreshingPage(false)        
    };


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
                        <Button disabled={isSubmitting} gray onClick={handleClose} type="button" w="100%">
                            <RichText
                                content={t('cancel')}
                            />
                        </Button>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }}>
                        <Button disabled={isSubmitting} isLoading={isSubmitting} type="submit" w="100%">
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
