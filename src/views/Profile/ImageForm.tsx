import { Avatar, Box, CircledIcon, Col, Row, Spinner, toast } from '@impact-market/ui';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import InputUpload from '../../components/InputUpload';
import Message from '../../libs/Prismic/components/Message';
import React, { useState } from "react";

const Form = ({ onSubmit }: any) => {
    const [isLoading, toggleLoading] = useState(false);
    const auth = useSelector(selectCurrentUser);
    const { extractFromView } = usePrismicData();
    const { uploadImage } = extractFromView('formSections') as any;

    const { control } = useForm();
    
    const image = getImage({ filePath: auth?.user?.avatarMediaPath, fit: 'cover', height: 120, width: 120 });

    // TODO: esta função está a ser chamada logo no inicio, não espera pelo onChange do input */
    const handleFiles = (data: any) => {
        try {
            toggleLoading(true);
            onSubmit(data);
            toggleLoading(false);

            // TODO: descomentar se for para ficar aqui o alerta
            // toast.success(<Message id="successfullyChangedData" />);
        }
        catch(e) {
            console.log(e);

            toggleLoading(false);

            toast.error(<Message id="errorOccurred" />);
        }
    }

    return (
        <>
            {
                isLoading ?
                <Spinner isActive margin="auto" />
                :
                <form>
                    <Box pl={1.5} pr={1.5}>
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
                                <InputUpload 
                                    accept={['image/png', 'image/jpeg', 'image/gif']}
                                    control={control}
                                    handleFiles={handleFiles}
                                    label={uploadImage}
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
