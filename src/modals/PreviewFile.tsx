import { Button, Img, ModalWrapper, Row, useModal } from '@impact-market/ui';
import { styled } from 'styled-components';
import React from 'react';

const ImageStyled = styled(Img)`
    object-fit: contain;
    max-width: 100%;
    max-height: 550px;
`;

const PreviewFile: React.FC = () => {
    const { handleClose, filepath, type } = useModal();

    const fileExtension = type.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];

    return (
        <ModalWrapper
            maxW={50}
            padding={1.5}
            w="100%"
            h={imageExtensions.includes(fileExtension) ? 'fit-content' : 38}
        >
            <Row
                fDirection="column"
                fLayout="center space-between"
                flex
                margin={0}
                h="100%"
            >
                {imageExtensions.includes(fileExtension) ? (
                    <ImageStyled alt="" url={filepath} />
                ) : (
                    <iframe src={filepath} width="100%" height="500px" />
                )}
                <Button
                    onClick={() => handleClose()}
                    gray
                    padding="0 3rem"
                    w="fit-content"
                >
                    Close
                </Button>
            </Row>
        </ModalWrapper>
    );
};

export default PreviewFile;
