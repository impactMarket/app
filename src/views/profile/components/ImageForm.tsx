import { Avatar, Box, Button, CircledIcon, Col, Divider, Row } from '@impact-market/ui';
import { getImage } from '../../../utils/images';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm, useFormState } from "react-hook-form";
import { useSelector } from 'react-redux';
import React from "react";
import String from '../../../libs/Prismic/components/String';

const Form = ({ onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);

    const { control, register, handleSubmit, formState: { errors } } = useForm<any>();
    const { isSubmitting } = useFormState({ control });
    
    const image = getImage({ filePath: auth?.user?.avatarMediaPath, fit: 'cover', height: 118, width: 118 });

    // TODO: colocar textos no prismic
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box pl={1} pr={1}>
                <Row>
                    <Col colSize={3}>
                        {
                            image ?
                            <Avatar large url={image} />
                            :
                            <CircledIcon icon="users" large />
                        }
                    </Col>
                    <Col colSize={9}>
                        <label htmlFor="img">Image</label>
                        <br />
                        <input id="img" type="file" {...register("img", { required: true })} accept="image/*" />
                        <br />
                        {errors.img && <span>This field is required</span>}
                    </Col>
                </Row>
            </Box>
            <Divider/>
            <Box pl={1} pr={1}>
                <Row>
                    <Col colSize={12} right>
                        <Button default isLoading={isSubmitting} type="submit">
                            <String id="saveChanges" />
                        </Button>
                    </Col>
                </Row>
            </Box>
        </form>
    );
}

export default Form;