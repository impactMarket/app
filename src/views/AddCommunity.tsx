/* eslint-disable react-hooks/rules-of-hooks */
import { Accordion, AccordionItem, Alert, Avatar, Box, Button, Card, CircledIcon, Col, Countdown, Display, Grid, ProgressBar, Row, Text, ViewContainer, colors, openModal } from '@impact-market/ui';
import { SubmitHandler, useForm } from "react-hook-form";
import { currencyFormat } from '../utils/currency';
import { formatAddress } from '../utils/formatAddress';
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userManager } from '../utils/userTypes';
import Image from '../libs/Prismic/components/Image';
import React, { useState } from 'react';
import RichText from '../libs/Prismic/components/RichText';
import String from '../libs/Prismic/components/String';

type Inputs = {
    name: string,
    description: string,
    cover_img: any,
    profile_img: any,
    claim_amount: number,
    claim_frequency: string,
    claim_increment: number,
    private: boolean
};

const AddCommunity: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;
    const [formData, setFormData] = useState({});
    const [isSubmitting, toggleSubmitting] = useState(false);
    
    // TODO: load information from prismic and use it in the content
    // const { view } = usePrismicData();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const auth = useSelector(selectCurrentUser);
    const router = useRouter();

    // TODO: Uncomment this code
    // Check if current User has access to this page
    // if(!auth?.user?.type?.includes(userManager)) {
    //     router.push('/');

    //     return null;
    // }

    // TODO: finish onSubmit function
    const openSubmitModal: SubmitHandler<any> = (data) => {
        setFormData(data);

        openModal('addCommunity', { data, isSubmitting, onSubmit });
    };

    const onSubmit = () => {
        try {
            toggleSubmitting(true);

            console.log('add community: ', formData);

            toggleSubmitting(false);
        }
        catch(e) {
            console.log(e);
            toggleSubmitting(false);
        }
    }

    // TODO: Check if the save button will only appear in the top (save button for each section doesn't make sense here, only in the edit page)

    return (
        <ViewContainer isLoading={isLoading}>
            <form onSubmit={handleSubmit(openSubmitModal)}>
                <Row fLayout="start">
                    <Col colSize={{ md: 9, xs: 8 }}>
                        <Display medium>
                            Community Submission
                        </Display>
                        <Text g500 mt={0.25}>
                            After submitting, your community will be listed for review. Learn how our community review process works.
                        </Text>
                    </Col>
                    <Col colSize={{ md: 3, xs: 4 }} right>
                        { /* TODO: Replace by correct icon */ }
                        <Button icon="plusCircle" type="submit">
                            Submit
                        </Button>
                    </Col>
                </Row>
                <Box mt={4}>
                    <Row>
                        <Col colSize={{ sm: 4, xs: 12 }}>
                            <Text g700 medium small>Community Details</Text>
                            <Text g500 regular small>Tell us more about your community.</Text>
                        </Col>
                        <Col colSize={{ sm: 8, xs: 12 }}>
                            <Card padding={1.5}>
                                { /* TODO: Fix styles in UI, add font-weight and possibility of icon and text in the same line */ }
                                <Alert icon="alertCircle" info mb={1}>
                                    <Text>
                                        Communities with all the details completed, including the managers photos, are more likely to get funded.
                                    </Text>
                                </Alert>

                                { /* TODO: Add final inputs */ }
                                <label htmlFor="name">Community Name</label>
                                <br />
                                <input id="name" {...register("name", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.name && <span>This field is required</span>}
                                <br /><br />

                                <label htmlFor="description">Community Description</label>
                                <br />
                                <textarea id="description" {...register("description")} style={{ border: '1px solid black' }} />
                                <br /><br /><br />

                                <label htmlFor="cover_img">Community Cover Image</label>
                                <br />
                                <input id="cover_img" type="file" {...register("cover_img", { required: true })} accept="image/*" />
                                <br />
                                {errors.cover_img && <span>This field is required</span>}
                                <br /><br /><br />

                                <label htmlFor="profile_img">Your profile photo</label>
                                <p>We noticed you haven’t uploaded any profile photo. Learn how to choose a great photo.</p>
                                <br />
                                <input id="profile_img" type="file" {...register("profile_img", { required: true })} accept="image/*" />
                                <br />
                                {errors.profile_img && <span>This field is required</span>}
                            </Card>
                        </Col>
                    </Row>
                </Box>
                <Box mt={4}>
                    <Row>
                        <Col colSize={{ sm: 4, xs: 12 }}>
                            <Text g700 medium small>Contract Details</Text>
                            <Text g500 regular small>Here you will define the UBI paramenters.</Text>
                        </Col>
                        <Col colSize={{ sm: 8, xs: 12 }}>
                            <Card padding={1.5}>
                                { /* TODO: Fix styles in UI, add font-weight and possibility of icon and text in the same line */ }
                                { /* TODO: Add real time breakdown in the alert content */ }
                                <Alert icon="alertCircle" info mb={1}>
                                    <Text>
                                        This UBI will take at least 5y 2m 23 days per beneficiary
                                    </Text>
                                </Alert>

                                { /* TODO: In UI we don't have the color or text size specified here in the design */ }
                                <Text mb={1.5}>
                                    These values should be a minimum basic income that is sufficient to meet your beneficiaries basic needs. They will be able to claim while there are funds available in the contract. You will have the responsibility to promote your community and to raise funds for it.
                                    <br/><br/>
                                    If there is another person or organization among your community you believe is more suitable to drive this initiative, let them know about this possibility and encourage them to create a community.
                                </Text>

                                { /* TODO: Add final inputs */ }
                                <label htmlFor="claim_amount">Amount per claim</label>
                                <br />
                                <input id="claim_amount" {...register("claim_amount", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.claim_amount && <span>This field is required</span>}
                                <br /><br />

                                <label htmlFor="claim_increment">Total time increment after each claim</label>
                                <br />
                                <input id="claim_increment" {...register("claim_increment", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.claim_increment && <span>This field is required</span>}

                                <Box mt={1.5} pt={1.5} style={{ borderTop: `1px solid ${colors.g200}` }}>
                                    <label htmlFor="private">Private Community</label>
                                    <p>This community will not be listed on impactmarket community listing.</p>
                                    <br />
                                    <input id="private" {...register("private")} style={{ border: '1px solid black' }} type="checkbox" />
                                </Box>
                            </Card>
                        </Col>
                    </Row>
                </Box>
            </form>
        </ViewContainer>
    );
};

export default AddCommunity;
