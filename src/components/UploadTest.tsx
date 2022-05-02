import { Box } from '@impact-market/ui';
import { useDropzone } from 'react-dropzone';
import React, { useEffect } from 'react';

// eslint-disable-next-line react/display-name
const InputUpload = React.forwardRef((props: any, ref) => {
    const { children, handleFiles, wrapperProps, ...dropzoneOptions } = props;

    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true,
        ...dropzoneOptions
    });

    useEffect(() => {
        handleFiles(acceptedFiles);
    }, [acceptedFiles]);

    return (
        <a {...wrapperProps} {...getRootProps()} onClick={open} style={{ border: '1px solid #000000' }}>
            {!!children && <Box mt={0.75}>{children}</Box>}
            <input {...getInputProps()} ref={ref} />
        </a>
    );
});

export default InputUpload;
