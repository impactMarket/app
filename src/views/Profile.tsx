import { Box, Button, Card, Col, Display, Row, Text, ViewContainer } from '@impact-market/ui';
import { SubmitHandler, useForm } from "react-hook-form";
import { selectCurrentUser } from '../state/slices/auth';
import { usePrismicData } from '../libs/Prismic/components/PrismicDataProvider';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation } from '../api/user';
import React from 'react';

type Inputs = {
    firstName: string,
    lastName: string,
    age: number,
    bio: string,
    country: string,
    gender: string,
    email: string,
    children: number
};

const Profile: React.FC<{ isLoading?: boolean }> = props => {
    const { isLoading } = props;

    // const { view } = usePrismicData({ list: true });

    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const auth = useSelector(selectCurrentUser);
    const [updateUser] = useUpdateUserMutation();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);

        const payload = await updateUser({
            email: 'rui.sa@codepoint.pt',
            ...data
        });

        console.log(payload);
    };

    console.log("watch: ", watch("firstName"));
 
    return (
        <ViewContainer isLoading={isLoading}>
            <Row>
                <Col colSize={6}>
                    <Display>
                        {auth?.user?.username || 'John Doe'}
                    </Display>
                </Col>
                <Col colSize={6} right>
                    <Button default icon="logout">
                        Disconnect Wallet
                    </Button>
                </Col>
            </Row>
            <Box mt={4}>
                <Row>
                    <Col colSize={4}>
                        <Text g700 medium small>Personal Information</Text>
                        <Text g500 medium small>Update your photo and personal details.</Text>
                    </Col>
                    <Col colSize={8}>
                        <Card>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="firstName">First Name</label>
                                <br />
                                <input id="firstName" {...register("firstName", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.firstName && <span>This field is required</span>}
                                <br /><br />

                                <label htmlFor="lastName">Last Name</label>
                                <br />
                                <input id="lastName" {...register("lastName", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.lastName && <span>This field is required</span>}
                                <br /><br />

                                <label htmlFor="age">Age</label>
                                <br />
                                <input id="age" {...register("age", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.age && <span>This field is required</span>}
                                <br /><br />

                                <label htmlFor="bio">Bio</label>
                                <br />
                                <textarea id="bio" {...register("bio")} style={{ border: '1px solid black' }} />
                                <br /><br />

                                <p>Gender</p>
                                <label htmlFor="male">Male</label>
                                <input id="male" {...register("gender")} type="radio" value="male" />
                                <br />
                                <label htmlFor="female">Female</label>
                                <input id="female" {...register("gender")} type="radio" value="female" />
                                <br />
                                <label htmlFor="other">Other</label>
                                <input id="other" {...register("gender")} type="radio" value="other" />
                                <br /><br />

                                <label htmlFor="country">Country</label>
                                <br />
                                <select id="country" {...register("country")} style={{ border: '1px solid black' }}>
                                    <option value="pt">Portugal</option>
                                    <option value="fr">França</option>
                                    <option value="es">Espanha</option>
                                    <option value="it">Itália</option>
                                </select>
                                <br /><br />

                                <br />
                                <input type="submit" />
                            </form>
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={4}>
                        <Text g700 medium small>Contact information</Text>
                        <Text g500 medium small>Update your email.</Text>
                    </Col>
                    <Col colSize={8}>
                        <Card>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="email">Email</label>
                                <br />
                                <input id="email" {...register("email", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.email && <span>This field is required</span>}
                                <br /><br />

                                <br />
                                <input type="submit" />
                            </form>
                        </Card>
                    </Col>
                </Row>
            </Box>
            <Box mt={1.25}>
                <Row>
                    <Col colSize={4}>
                        <Text g700 medium small>Aditional information</Text>
                        <Text g500 medium small>Help us know your reality better.</Text>
                    </Col>
                    <Col colSize={8}>
                        <Card>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="children">How many childrens do you have? (we will check this in person)</label>
                                <br />
                                <input id="children" {...register("children", { required: true })} style={{ border: '1px solid black' }} />
                                <br />
                                {errors.children && <span>This field is required</span>}
                                <br /><br />

                                <br />
                                <input type="submit" />
                            </form>
                        </Card>
                    </Col>
                </Row>
            </Box>
        </ViewContainer>
    );
};

export default Profile;