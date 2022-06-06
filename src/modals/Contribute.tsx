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
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import Message from '../libs/Prismic/components/Message';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import styled from 'styled-components';
import useTranslations from '../libs/Prismic/hooks/useTranslations';

const BorderWrapper = styled(Box)`
    padding: 1rem;
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
    const { extractFromModals } = usePrismicData();
    const { t } = useTranslations();
    
    const { placeholder, balance, content, tip, title } = extractFromModals('contribute') as any;
    
    const onSubmit: SubmitHandler<any> = () => {
        try {
            setApproving(true);
            //  TODO: add the contribute logic
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
                content={title}
                large
                mt={1.25}
                semibold
            />
            
            
            {/* TODO:  ADD link for Learn more */}
            <RichText
                content={content}
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
                {t('learnMore')}
            </TextLink>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box mt={1.25}>
                    <BorderWrapper>
                        <Box fLayout="between" flex mb={0.5}>
                            <Box>
                                {/* TODO:  Add currency icon */}
                                {/* <Currency currency="cUSD" /> */}
                                <Text bold ml={0.5} small>
                                    cUSD
                                </Text>
                            </Box>
                            {/* TODO: Add balance from wallet */}
                            <Box fLayout="end" flex>
                            <RichText content={balance} regular small variables={{ balance: 10 }}/>
                                <Text regular small>
                                    {' cUSD'}
                                </Text>
                            </Box>
                        </Box>
                        <Input
                            control={control}
                            hint={errors?.value ? 'This field is required' : ''}
                            label="Contribute"
                            mt={0.5}
                            name="value"
                            placeholder={placeholder}
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
                        <Box bgColor={colors.p500} borderRadius="50%" padding="4px 10px">
                            <Text n01 regular small>1</Text>
                        </Box>
                    </Col>
                    <Col colSize={{ sm: 6, xs: 6 }} fLayout="center" flex>
                        <Box bgColor={colors.p200} borderRadius="50%" padding="4px 10px">
                            <Text n01 regular small>2</Text>
                        </Box>
                    </Col>
                </Row>

                <Row>
                    {/* TODO:  Add validations */}
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
                                content={title}
                            />
                        </Button>
                    </Col>
                </Row>
                {/* TODO: ADD link for troubleshoot area */}
                { approving && <RichText
                    content={tip}
                    g500
                    mt={0.5}
                    small
                />}
            </form>
        </ModalWrapper>
    );
};

export default Contribute;
