import { Box, Col, Display, Row, Text, ViewContainer, toast } from '@impact-market/ui';
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
            const payload = await updateUser({
                ...data
            }).unwrap();

            dispatch(setUser({ user: { ...payload }}));

            // TODO: colocar textos no prismic
            toast.success("Successfully changed data!");
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
            <Box mt={3.563}>
                <Row>
                    <Col colSize={4}>
                        <Text g700 medium small>{basicTitle}</Text>
                        <RichText content={basicDescription} g500 regular small />
                    </Col>
                    <Col colSize={8}>
                        <BasicForm onSubmit={onSubmit} />
                    </Col>
                </Row>
            </Box>
        </ViewContainer>
    );
};

export default Settings;