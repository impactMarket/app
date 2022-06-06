import { Alert, Box, Card, Col, Row, Text, Thumbnail } from '@impact-market/ui';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import GooglePlaces from '../../components/GooglePlaces';
import Input from '../../components/Input';
import InputUpload from '../../components/InputUpload';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const CommunityForm: React.FC<{ control: any, errors: any, isLoading: boolean, userImage: string, communityImage: any, profileImage: any, setCommunityImage: Function, setProfileImage: Function }> = props => {
    const { communityImage, control, errors, isLoading, profileImage, setCommunityImage, setProfileImage, userImage } = props;
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { communityAlert, communityDescription, communityDescriptionPlaceholder, communityImageDescription, communityImageUpload, communityTitle } = extractFromView('formSections') as any;
    
    const handleCommunityImage = (event: any) => {
        if(event?.length > 0) {
            setCommunityImage(event[0]);
        }
    };

    const handleProfileImage = (event: any) => {
        if(event?.length > 0) {
            setProfileImage(event[0]);
        }
    };

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
                            limit={275}
                            name="description"
                            placeholder={communityDescriptionPlaceholder?.length > 0 ? communityDescriptionPlaceholder[0]?.text : ''}
                            rows={6}
                            withError={!!errors?.description}
                        />
                    </Box>
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
                    <Box mt={1.5}>
                        { /* TODO: add text to Prismic */ }
                        <Text g700 mb={0.5} medium small>Community Cover Image</Text>
                        <InputUpload 
                            accept={['image/png', 'image/jpeg']}
                            control={control}
                            disabled={isLoading}
                            handleFiles={handleCommunityImage}
                            hint={errors?.coverImg ? t('fieldRequired') : ''}
                            label={<RichText content={communityImageUpload} g500 regular small variables={{ height: 300, width: 300 }} />}
                            multiple={false}
                            name="coverImg"
                            withError={!!errors?.coverImg}
                        />
                        {!!communityImage && (
                            <Box mt={0.75}>
                                <Thumbnail
                                    disabled={isLoading}
                                    handleClick={(event: any) => {
                                        event.preventDefault();
                                        setCommunityImage(null);
                                    }}
                                    icon="trash"
                                    url={URL.createObjectURL(communityImage)}
                                />
                            </Box>
                        )}
                    </Box>
                    {
                        userImage &&
                        <Box mt={1.5}>
                            <Text g700 mb={0.25} medium small><String id="yourProfilePhoto" /></Text>
                            <RichText content={communityImageDescription} g500 mb={0.5} small />
                            <InputUpload 
                                accept={['image/png', 'image/jpeg']}
                                control={control}
                                disabled={isLoading}
                                handleFiles={handleProfileImage}
                                label={<RichText content={communityImageUpload} g500 regular small variables={{ height: 300, width: 300 }} />}
                                multiple={false}
                                name="profileImg"
                            />
                            {!!profileImage && (
                                <Box mt={0.75}>
                                    <Thumbnail
                                        disabled={isLoading}
                                        handleClick={(event: any) => {
                                            event.preventDefault();
                                            setProfileImage(null);
                                        }}
                                        icon="trash"
                                        url={URL.createObjectURL(profileImage)}
                                    />
                                </Box>
                            )}
                        </Box>
                    }
                </Card>
            </Col>
        </Row>
    );
};

export default CommunityForm;
