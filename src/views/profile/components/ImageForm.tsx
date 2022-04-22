import { Avatar, Box, CircledIcon, Col, Row, Spinner, toast } from '@impact-market/ui';
import { getImage } from '../../../utils/images';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import ImageUpload from '../../../components/ImageUpload';
import React, { useState } from "react";

const Form = ({ onSubmit }: any) => {
    const [isLoading, toggleLoading] = useState(false);
    const auth = useSelector(selectCurrentUser);

    const { control } = useForm();
    
    const image = getImage({ filePath: auth?.user?.avatarMediaPath, fit: 'cover', height: 120, width: 120 });

    // TODO: esta função está a ser chamada logo no inicio, não espera pelo onChange do input */
    const handleFiles = (data: any) => {
        try {
            toggleLoading(true);
            onSubmit(data);
            toggleLoading(false);
        }
        catch(e) {
            console.log(e);

            toggleLoading(false);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    }

    // TODO: colocar textos no prismic

    return (
        <>
            {
                isLoading ?
                <Spinner isActive margin="auto" />
                :
                <form>
                    <Box pl={1.5} pr={1.5}>
                        <Row fLayout="center start">
                            <Col colSize={3}>
                                { /* TODO: missing icon "user" */ }
                                {
                                    image ?
                                    <Avatar large url={image} />
                                    :
                                    <CircledIcon extralarge icon="users" />
                                }
                            </Col>
                            <Col colSize={9}>
                                { /* TODO: ver como fica a parte azul do texto que está no design */ }
                                <ImageUpload 
                                    control={control}
                                    handleFiles={handleFiles}
                                    label="Click to upload or drag and drop SVG, PNG, JPG or GIF"
                                    name="img"
                                    wrapperProps={{
                                        mt: 0.75
                                    }}
                                />
                            </Col>
                        </Row>
                    </Box> 
                </form>
            }
        </>
        
    );
}

export default Form;