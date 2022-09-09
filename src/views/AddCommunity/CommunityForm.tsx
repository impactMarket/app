import { Alert, Box, Card, Col, Row, Text, Thumbnail } from '@impact-market/ui';
import { useFormState } from "react-hook-form";
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import FormActions from '../Profile/FormActions';
import GooglePlaces from '../../components/GooglePlaces';
import Input from '../../components/Input';
import InputUpload from '../../components/InputUpload';
import React, { useState } from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';


const CommunityForm: React.FC<{ control: any, errors: any, isLoading: boolean, communityImage: any, setCommunityImage: Function, communityStatus?: string, submitCount: number, save?: boolean, reset?: () => void  }> = props => {
    const { communityImage, communityStatus, control, errors, isLoading, setCommunityImage, submitCount, save = false, reset = () => {} } = props;
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { communityAlert, communityDescription, communityDescriptionPlaceholder, communityImageUpload, communityTitle } = extractFromView('formSections') as any;
    const [imageUploaded, setImageUploaded] = useState(false);

    const handleCommunityImage = (event: any) => {
        if(event?.length > 0) {
            setImageUploaded(true);
            setCommunityImage(event[0]);
        }
    };

    const { isDirty } = useFormState({ control });
    // TODO: check what links to add and how to add the links in "Learn to write description" and "Learn to choose a photo" texts

    return (
        <Row>
            <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Text g700 medium small>{communityTitle}</Text>
                <RichText content={communityDescription} g500 regular small />
            </Col>
            <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Card padding={1.5}>
                    <Alert
                        icon="alertCircle"
                        info
                        title={<RichText content={communityAlert} medium p600 small />}
                    />
                    <Box mt={1.5}>
                        <Input
                            control={control}
                            disabled={isLoading}
                            hint={errors?.name ? t('fieldRequired') : ''}
                            label={t('communityName')}
                            name="name"
                            withError={!!errors?.name}
                        />
                    </Box>
                    <Box mt={1.5}>
                        <Input
                            control={control}
                            disabled={isLoading}
                            hint={errors?.description ? t('fieldRequired') : ''}
                            label={t('communityDescription')}
                            limit={2048}
                            min={240}
                            name="description"
                            placeholder={communityDescriptionPlaceholder?.length > 0 ? communityDescriptionPlaceholder[0]?.text : ''}
                            rows={6}
                            withError={!!errors?.description}
                        />
                    </Box>
                    {(!communityStatus || communityStatus === 'pending') &&
                        <Box mt={1.5}>
                            <GooglePlaces
                                control={control}
                                disabled={isLoading}
                                hint={errors?.location ? t('fieldRequired') : ''}
                                label={t('cityCountry')}
                                name="location"
                                withError={!!errors?.location}
                            />
                        </Box>
                    }
                    <Box mt={1.5}>
                        <Text g700 mb={0.5} medium small><String id="communityCoverImage" /></Text>
                        <InputUpload
                            accept={['image/png', 'image/jpeg']}
                            control={control}
                            disabled={isLoading}
                            handleFiles={handleCommunityImage}
                            hint={submitCount > 0 && !communityImage ? t('fieldRequired') : ''}
                            label={<RichText content={communityImageUpload} g500 regular small variables={{ height: 300, width: 300 }} />}
                            multiple={false}
                            name="coverImg"
                            withError={submitCount > 0 && !communityImage}
                        />
                        {!!communityImage && (
                            <Box mt={0.75}>
                                <Thumbnail
                                    disabled={isLoading}
                                    h={10}
                                    handleClick={(event: any) => {
                                        event.preventDefault();
                                        setCommunityImage(null);
                                    }}
                                    icon="trash"
                                    url={typeof communityImage === 'string' ? communityImage : URL.createObjectURL(communityImage)}
                                    w={10}
                                />
                            </Box>
                        )}
                    </Box>
                    {
                        (isDirty || imageUploaded) && save && <FormActions handleCancel={reset} isSubmitting={isLoading} />
                    }
                </Card>
            </Col>
        </Row>
    );
};

export default CommunityForm;
