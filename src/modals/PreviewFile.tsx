import { Button, Img, ModalWrapper, Row, useModal } from '@impact-market/ui';
import React from 'react';
import styled from 'styled-components';
import useTranslations from 'src/libs/Prismic/hooks/useTranslations';

const ImageStyled = styled(Img)`
    object-fit: contain;
    max-width: 100%;
    max-height: 550px;
`;

const PreviewFile: React.FC = () => {
    const { t } = useTranslations();
    const { handleClose, filepath, type } = useModal();

    const fileExtension = type.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
    const isImage = imageExtensions.includes(fileExtension);

    return (
        <ModalWrapper
            maxW={50}
            padding={1.5}
            w="100%"
            h={isImage ? 'fit-content' : 38}
        >
            <Row
                fDirection="column"
                fLayout="center space-between"
                flex
                margin={0}
                h="100%"
            >
                {isImage ? (
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
                    {t('close')}
                </Button>
            </Row>
        </ModalWrapper>
    );
};

export default PreviewFile;
