import { Box, Col, Display, Divider, Row, Text, ViewContainer, toast } from '@impact-market/ui';
import { SubmitHandler } from "react-hook-form";
import { setUser } from '../../state/slices/auth';
import { useDispatch } from 'react-redux';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useUpdateUserMutation } from '../../api/user';
import BasicForm from './components/BasicForm';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';

const Settings: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    const { extractFromView } = usePrismicData();
    const { title, content } = extractFromView('heading') as any;
    const { basicTitle, basicDescription } = extractFromView('formSections') as any;

    const [updateUser] = useUpdateUserMutation();
    const dispatch = useDispatch();

    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const result = await updateUser({
                ...data
            }).unwrap();

            if(result) {
                dispatch(setUser({ user: { ...result }}));

                // TODO: colocar textos no prismic
                toast.success("Successfully changed data!");
            }
        }
        catch(e) {
            console.log(e);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    };

    return (
        <ViewContainer isLoading={isLoading}>
            <Box>
                <Display g900 medium>{title}</Display>
                <RichText content={content} g500 mt={0.25} regular/>
            </Box>
            <Divider mb={2} mt={1.5} />
            <Box>
                <Row>
                    <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 2.5 }}>
                        <Text g700 medium small>{basicTitle}</Text>
                        <RichText content={basicDescription} g500 regular small />
                    </Col>
                    <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                        <BasicForm onSubmit={onSubmit} />
                    </Col>
                </Row>
            </Box>
            <Divider mt={2.5}/>
        </ViewContainer>
    );
};

export default Settings;
