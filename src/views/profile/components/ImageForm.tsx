import { Avatar, Box, CircledIcon, Col, Row, Spinner, toast } from '@impact-market/ui';
import { getImage } from '../../../utils/images';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import InputUpload from '../../../components/InputUpload';
import React, { useState } from "react";
import UploadTest from '../../../components/UploadTest';

const Form = ({ onSubmit }: any) => {
    const [isLoading, toggleLoading] = useState(false);
    const [cenas, setCenas] = useState();
    const auth = useSelector(selectCurrentUser);

    const { control } = useForm();
    
    const image = getImage({ filePath: auth?.user?.avatarMediaPath, fit: 'cover', height: 120, width: 120 });

    // TODO: esta função está a ser chamada logo no inicio, não espera pelo onChange do input */
    const handleFiles = (data: any) => {
        try {
            toggleLoading(true);
            onSubmit(data);
            toggleLoading(false);

            // TODO: colocar textos no prismic
            // TODO: descomentar se for para ficar aqui o alerta
            // toast.success("Successfully changed data!");
        }
        catch(e) {
            console.log(e);

            toggleLoading(false);

            // TODO: colocar textos no prismic
            toast.error("An error has occurred! Please try again later.");
        }
    }

    const handleFiles2 = (data: any) => {
        console.log(data);
        setCenas(data);
    }

    return (
        <>
            {
                isLoading ?
                <Spinner isActive margin="auto" />
                :
                <form>
                    <Box pl={1.5} pr={1.5}>
                        <Row>
                            <UploadTest handleFiles={handleFiles2} children={JSON.stringify(cenas)}/>
                        </Row>
                        <Row fLayout="center start">
                            <Col colSize={{ sm: 3, xs: 12 }} pb={{ sm: 1, xs: 1.25 }}>
                                { /* TODO: missing icon "user" */ }
                                {
                                    image ?
                                    <Avatar large url={image}/>
                                    :
                                    <CircledIcon extralarge icon="users"/>
                                }
                            </Col>
                            <Col colSize={{ sm: 9, xs: 12 }} pt={{ sm: 1, xs: 0 }}>
                                { /* TODO: ver como fica a parte azul do texto que está no design */ }
                                { /* TODO: colocar textos no prismic */ }
                                <InputUpload 
                                    accept={['image/png', 'image/jpeg', 'image/gif']}
                                    control={control}
                                    handleFiles={handleFiles}
                                    label="Click to upload or drag and drop PNG, JPG or GIF"
                                    name="img"
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
