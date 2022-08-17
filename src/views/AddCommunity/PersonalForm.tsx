/* eslint-disable no-nested-ternary */
import { Box, Card, Col, Divider, Row, Text, Thumbnail } from '@impact-market/ui';
import { PutPostUser } from '../../api/user';
import { usePrismicData } from '../../libs/Prismic/components/PrismicDataProvider';
import Input from '../../components/Input';
import InputUpload from '../../components/InputUpload';
import React from 'react';
import RichText from '../../libs/Prismic/components/RichText';
import String from '../../libs/Prismic/components/String';
import useTranslations from '../../libs/Prismic/hooks/useTranslations';

const PersonalForm: React.FC<{ control: any, errors: any, isLoading: boolean, user: PutPostUser, profileImage: any, setProfileImage: Function, submitCount: number }> = props => {
    const { control, errors, isLoading, profileImage, setProfileImage, submitCount, user } = props;
    const { t } = useTranslations();

    const { extractFromView } = usePrismicData();
    const { communityImageDescription, communityImageUpload, managerDetails, basicProfileData } = extractFromView('formSections') as any;
    
    const handleProfileImage = (event: any) => {
        if(event?.length > 0) {
            setProfileImage(event[0]);
        }
    };

    // TODO: check what link to add and how to add the links in "Learn to choose a photo" text
    // TODO: add texts to view in Prismic

    return (
        <Row>
            <Col colSize={{ sm: 4, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Divider margin="1.25 0" show={{ sm: 'none', xs: 'block' }} />
                <Text g700 medium small>{managerDetails}</Text>
                <RichText content={basicProfileData} g700 medium small />
            </Col>
            <Col colSize={{ sm: 8, xs: 12 }} pb={1.25} pt={{ sm: 1.25, xs: 0 }}>
                <Card padding={1.5}>
                    {
                        !user?.avatarMediaPath &&
                        <Box>
                            <Text g700 mb={0.25} medium small><String id="yourProfilePhoto" /></Text>
                            <RichText content={communityImageDescription} g500 mb={0.5} small />
                            <InputUpload
                                accept={['image/png', 'image/jpeg']}
                                control={control}
                                disabled={isLoading}
                                handleFiles={handleProfileImage}
                                hint={submitCount > 0 && !profileImage ? t('fieldRequired') : ''}
                                label={<RichText content={communityImageUpload} g500 regular small variables={{ height: 300, width: 300 }} />}
                                multiple={false}
                                name="profileImg"
                                withError={submitCount > 0 && !profileImage}
                            />
                            {!!profileImage && (
                                <Box mt={0.75}>
                                    <Thumbnail
                                        disabled={isLoading}
                                        h={10}
                                        handleClick={(event: any) => {
                                            event.preventDefault();
                                            setProfileImage(null);
                                        }}
                                        icon="trash"
                                        url={URL.createObjectURL(profileImage)}
                                        w={10}
                                    />
                                </Box>
                            )}
                        </Box>
                    }
                    {
                        (!user?.firstName || !user?.lastName) &&
                        <Row mt={!user?.avatarMediaPath ? 1.5 : 0}>
                            {
                                !user?.firstName &&
                                <Col colSize={{ sm: 6, xs: 12 }} pb={{ sm: 0, xs: 0.75 }} pt={0}>
                                    <Input
                                        control={control}
                                        disabled={isLoading}
                                        hint={
                                            errors?.firstName?.message?.key ?
                                            t(errors?.firstName?.message?.key)?.replace('{{ value }}', errors?.firstName?.message?.value) :
                                            errors?.firstName ?
                                            t('fieldRequired') :
                                            ''
                                        }
                                        label={t('firstName')}
                                        name="firstName"
                                        withError={!!errors?.firstName}
                                    />
                                </Col>
                            }
                            {
                                !user?.lastName &&
                                <Col colSize={{ sm: 6, xs: 12 }} pt={{ sm: 0, xs: 0.75 }}>
                                    <Input
                                        control={control}
                                        disabled={isLoading}
                                        hint={
                                            errors?.lastName?.message?.key ?
                                            t(errors?.lastName?.message?.key)?.replace('{{ value }}', errors?.lastName?.message?.value) :
                                            errors?.lastName ?
                                            t('fieldRequired') :
                                            ''
                                        }
                                        label={t('lastName')}
                                        name="lastName"
                                        withError={!!errors?.lastName}
                                    />
                                </Col>
                            }
                        </Row>
                    }
                    {
                        !user?.email &&
                        <Box mt={!user?.avatarMediaPath || !user?.firstName || !user?.lastName ? 1.5 : 0}>
                            <Input
                                control={control}
                                disabled={isLoading}
                                hint={errors?.email ? t('errorEmail') : ''}
                                label={t('email')}
                                name="email"
                                withError={!!errors?.email}
                            />
                        </Box>
                    }
                </Card>
            </Col>
        </Row>
    );
};

export default PersonalForm;
