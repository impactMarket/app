import { Box, Button, Card, Col, Input, Row, colors } from '@impact-market/ui';
import { mq } from 'styled-gen';
import RichText from '../../../libs/Prismic/components/RichText';
import styled, { css } from 'styled-components';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

const Section = styled(Row)`
    ${mq.phone(css`
        margin-bottom: 3rem;

        .section-info {
            margin-bottom: 1rem;
        }
    `)};
`;

const SelectElement = styled(Button)`
    background-color: white;
    border-radius: 0;
    color: ${colors.g800};
    padding: 0.6rem;
    border-color: ${colors.g300};
    transition: none;
    flex: 1;

    .button-content {
        font-size: 0.8rem;
        padding: 0;
    }

    &:hover:not(.disabled),
    &.active:not(.disabled) {
        background-color: ${colors.p50} !important;
        border-color: ${colors.g300} !important;
    }

    &:hover.disabled {
        cursor: auto;
        background-color: initial !important;
        border-color: ${colors.g300} !important;
    }

    &.active.disabled {
        background-color: ${colors.g200} !important;
        border-color: ${colors.g200} !important;
    }

    &:first-of-type {
        border-radius: 8px 0px 0px 8px;
        border-right: 0px;
    }

    &:last-of-type {
        border-radius: 0px 8px 8px 0px;
        border-left: 0px;
    }
`;

export interface ProfileProps {
    fieldType: string;
    idx: number;
    primary: any;
    profileData: any;
    readOnly: boolean;
    sectionId: string;
    setProfileData: (data: any) => void;
}

const Profile = (props: ProfileProps) => {
    const { sectionId, idx, primary, profileData, readOnly, setProfileData } =
        props;

    console.log(profileData);

    const { t } = useTranslations();
    const { title1, title2, description1, description2 } = primary;
    const { firstName, lastName, age, gender, email, phone } = profileData;
    const selectOptions = [
        { title: t('male'), value: 'm' },
        { title: t('female'), value: 'f' },
        { title: t('other'), value: 'o' }
    ];

    return (
        <Section mb="1.3rem">
            <Col
                className="section-info"
                colSize={{ sm: 4, xs: 12 }}
                pb={1.25}
                pt={{ sm: 1.25, xs: 0 }}
            >
                <RichText content={title1} g700 medium small semibold />
                <RichText content={description1} g500 regular small />
            </Col>
            <Col
                colSize={{ sm: 8, xs: 12 }}
                pb="1.25rem"
                pl="0"
                pt={{ sm: 1.25, xs: 0 }}
            >
                <Card padding="1.5rem">
                    <Box flex fLayout="start between">
                        <Box className="column" style={{ flexBasis: '48%' }}>
                            <RichText
                                content={t('firstName')}
                                g700
                                medium
                                semibold
                            />
                            <Input
                                id={`${sectionId}-${idx}`}
                                disabled={readOnly}
                                value={firstName ?? ''}
                                onChange={(e: any) => {
                                    setProfileData({
                                        ...profileData,
                                        firstName: e.target.value
                                    });
                                }}
                            />
                        </Box>
                        <Box className="column" style={{ flexBasis: '48%' }}>
                            <RichText
                                content={t('lastName')}
                                g700
                                medium
                                semibold
                            />

                            <Input
                                id={`${sectionId}-${idx}`}
                                disabled={readOnly}
                                value={lastName ?? ''}
                                onChange={(e: any) => {
                                    setProfileData({
                                        ...profileData,
                                        lastName: e.target.value
                                    });
                                }}
                            />
                        </Box>
                    </Box>
                    <Box pt="1.5rem" flex fLayout="start between">
                        <Box className="column" style={{ flexBasis: '48%' }}>
                            <RichText content={t('age')} g700 medium semibold />
                            <Input
                                id={`${sectionId}-${idx}`}
                                disabled={readOnly}
                                value={age ?? ''}
                                type="number"
                                onChange={(e: any) => {
                                    setProfileData({
                                        ...profileData,
                                        age: e.target.value
                                    });
                                }}
                            />
                        </Box>
                        <Box className="column" style={{ flexBasis: '48%' }}>
                            <RichText
                                content={t('gender')}
                                g700
                                medium
                                semibold
                            />
                            <Box flex>
                                {selectOptions.map(
                                    (option: any, id: number) => (
                                        <SelectElement
                                            pb=".5rem"
                                            className={`select-${id} ${
                                                gender === option.value
                                                    ? 'active'
                                                    : ''
                                            }
                                            ${readOnly ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (!readOnly) {
                                                    setProfileData({
                                                        ...profileData,
                                                        gender: option.value
                                                    });
                                                }
                                            }}
                                        >
                                            {option.title}
                                        </SelectElement>
                                    )
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Col>
            <Col
                className="section-info"
                colSize={{ sm: 4, xs: 12 }}
                pb={1.25}
                pt={{ sm: 1.25, xs: 0 }}
            >
                <RichText content={title2} g700 medium small semibold />
                <RichText content={description2} g500 regular small />
            </Col>
            <Col
                colSize={{ sm: 8, xs: 12 }}
                pb="1.25rem"
                pl="0"
                pt={{ sm: 1.25, xs: 0 }}
            >
                <Card padding="1.5rem">
                    <Box flex fLayout="start between">
                        <Box className="column" style={{ flex: '1' }}>
                            <RichText
                                content={t('yourEmail')}
                                g700
                                medium
                                semibold
                            />
                            <Input
                                id={`${sectionId}-${idx}`}
                                disabled={readOnly}
                                icon={'mail'}
                                name="email"
                                value={email ?? ''}
                                onChange={(e: any) => {
                                    setProfileData({
                                        ...profileData,
                                        email: e.target.value
                                    });
                                }}
                            />
                        </Box>
                    </Box>
                    <Box pt="1.5rem" flex fLayout="start between">
                        <Box className="column" style={{ flex: '1' }}>
                            <RichText
                                content={t('yourPhone')}
                                g700
                                medium
                                // small
                                semibold
                            />
                            <Input
                                id={`${sectionId}-${idx}`}
                                disabled={readOnly}
                                type="number"
                                value={phone}
                                onChange={(e: any) => {
                                    setProfileData({
                                        ...profileData,
                                        phone: e.target.value
                                    });
                                }}
                            />
                        </Box>
                    </Box>
                </Card>
            </Col>
        </Section>
    );
};

export default Profile;
