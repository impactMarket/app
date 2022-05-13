import { Avatar, Box, CircledIcon, Spinner } from '@impact-market/ui';
import { getImage } from '../../utils/images';
import { selectCurrentUser } from '../../state/slices/auth';
import { useForm } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import InputUpload from '../../components/InputUpload';
import React from "react";

const Form = ({ isLoading, onSubmit }: any) => {
    const auth = useSelector(selectCurrentUser);
    const { extractFromView } = usePrismicData();
    const { uploadImage } = extractFromView('formSections') as any;

    const { control } = useForm();
    
    const image = getImage({ filePath: auth?.user?.avatarMediaPath, fit: 'cover', height: 120, width: 120 });

    // TODO: this function is being called at page load, instead of waiting for an image being selected
    const handleFiles = (data: any) => {
        try {
            onSubmit(data);
        }
        catch(e) {
            console.log(e);
        }
    }

    return (
        <>
            {
                isLoading ?
                <Box fLayout="center" flex minH={7.5}><Spinner isActive /></Box>
                :
                <form>
                    <Box fDirection={{ sm: 'row', xs: 'column' }} fLayout={{ sm: "center start", xs: "start" }} flex pl={1.5} pr={1.5}>
                        <Box pb={{ sm: 0, xs: 1.25 }} pr={{ sm: 1.25, xs: 0 }}>
                            {
                                image ?
                                <Avatar large url={image}/>
                                :
                                <CircledIcon extralarge icon="user"/>
                            }
                        </Box>
                        <Box w="100%">
                            { /* TODO: ver como fica a parte azul do texto que está no design */ }
                            <InputUpload 
                                accept={['image/png', 'image/jpeg', 'image/gif']}
                                control={control}
                                handleFiles={handleFiles}
                                label={uploadImage}
                                name="img"
                            />
                        </Box>
                    </Box>
                </form>
            }
        </>
    );
}

export default Form;
