import {
    Box,
    Button,
    CircledIcon,
    Col,
    Icon,
    Input,
    ModalWrapper,
    Row,
    Text,
    TextLink,
    colors,
    toast,
    useModal
} from '@impact-market/ui';
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import Message from '../libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';

import styled from 'styled-components';

const BorderWrapper = styled(Box)`
    padding: 0.5rem;
    border: 1px solid ${colors.g300};
    border-radius: 8px;
`;

const CloseButton = styled(Button)`
    .button-content {
        padding: 0.5rem;
    }
`;

const Contribute = () => {
    const { handleClose } = useModal();

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            value: ''
        }
    });
    const { isSubmitting } = useFormState({ control });
    const [approving, setApproving] = useState(false);
    
    const onSubmit: SubmitHandler<any> = () => {
        try {
            setApproving(true);
            //  Todo: add the contribute logic
            // eslint-disable-next-line no-alert
            alert('In progress')
        }
        catch(e) {
            console.log(e);

            toast.error(<Message id="errorOccurred" />);
        }
    };


    return (
        <ModalWrapper maxW={30.25} padding={1.5} w="100%">
            <Box fLayout="between" flex w="100%">
                <Col>
                    <CircledIcon icon="alertCircle" large />
                </Col>
                <Col fDirection="column" fLayout="center" flex>
                    <CloseButton bgColor={colors.n01} gray onClick={handleClose} padding={0}>
                        <Icon g900 icon="close"/>
                    </CloseButton>
                </Col>
            </Box>
            <RichText
                content="Contribute"
                large
                mt={1.25}
                semibold
            />
            
            
            {/* Todo: Add texts on Prismic */}
            {/* ADD link for Learn more */}
            <RichText
                content="The number of PACT rewards you will get may vary 
                    depending on your contribution and total raised in the last 30 epochs."
                g500
                mt={0.5}
                small
            />
            <TextLink
                    onClick={() =>
                        console.log('Learn more')
                    }
                    p600
                    regular
                    small
            >
                Learn more
            </TextLink>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={1.25}>
                    <BorderWrapper>
                        <Box fLayout="between" flex>
                            <Box>
                                {/* Add currency icon */}
                                {/* <Currency currency="cUSD" /> */}
                                <Text bold ml={0.5} small>
                                    cUSD
                                </Text>
                            </Box>
                            <Box>
                                <Text regular small>
                                    {/* TODO: Add balance from wallet */}
                                    Balance: 10 cUSD
                                </Text>
                            </Box>
                        </Box>
                        <Input
                            control={control}
                            hint={errors?.value ? 'This field is required' : ''}
                            label="Contribute"
                            name="value"
                            rules={{ required: true }}
                            style={{'font-size': '1.5rem'}}
                            withError={!!errors?.value}
                            wrapperProps={{
                                padding: {xs: 0},
                                style: { boxShadow: "none", fontSize: '5.5rem' },
                            }}
                        />
                    </BorderWrapper>
                </Box>
                <Row mt={0.5}>
                    <Col colSize={{ sm: 6, xs: 6 }} fLayout="center" flex>
                        <Box bgColor={colors.p500} padding="4px 10px" radius="50%">
                            <Text n01 regular small>1</Text>
                        </Box>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }} fLayout="center" flex>
                        <Box bgColor={colors.p200} padding="4px 10px" radius="50%">
                            <Text n01 regular small>2</Text>
                        </Box>
                    </Col>
                </Row>

                <Row>
                    {/* Add validations */}
                    <Col colSize={{ sm: 6, xs: 6 }} pr={0.25}>
                        <Button disabled={isSubmitting} type="submit" w="100%">
                            <RichText
                                content="Approve cUSD"
                            />
                        </Button>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }} pl={0.25}>
                        <Button disabled isLoading={isSubmitting} type="submit" w="100%">
                            <RichText
                                content= "Contribute"                       
                            />
                        </Button>
                    </Col>
                </Row>
                {/* ADD link for troubleshoot area */}
                { approving && <RichText
                    content="This operation may take a couple seconds to complete. 
                        If you encounter any error please read our troubleshooting section."
                    g500
                    mt={0.5}
                    small
                />}
            </form>
        </ModalWrapper>
    );
};

export default Contribute;
