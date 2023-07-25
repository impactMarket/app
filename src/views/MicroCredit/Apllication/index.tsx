import {
    Box,
    Button,
    Col,
    Display,
    ProgressIndicator,
    Row,
    Text,
    ViewContainer,
    toast
} from '@impact-market/ui';
import { selectCurrentUser, setUser } from '../../../state/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import {
    useGetBorrowerFormsMutation,
    useGetFormIdMutation,
    useSubmitFormMutation
} from '../../../api/microcredit';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useUpdateUserMutation } from '../../../api/user';
import FormSection from './FormSection';
import Message from '../../../libs/Prismic/components/Message';
import Profile from './Profile';
import RichText from '../../../libs/Prismic/components/RichText';
import useTranslations from '../../../libs/Prismic/hooks/useTranslations';

type MatrixType = Record<string, Record<string, string | undefined>>;
type MatrixJsonType = {
    prismicId: string;
    form: MatrixType;
    submit: boolean;
};

const ApplicationForm = () => {
    const auth = useSelector(selectCurrentUser);
    const { signature } = useSelector(selectCurrentUser);
    const { t } = useTranslations();
    const { view } = usePrismicData();
    const [updateUser] = useUpdateUserMutation();
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [formArray, setFormArray] = useState([]);
    const [titleArray, setTitleArray] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prismicId, setPrismicId] = useState('');
    const [formApiData, setFormApiData] = useState({} as any);
    const [readyToProceed, setReadyToProceed] = useState(true);
    const [submitForm] = useSubmitFormMutation();
    const [getBorrowerForms] = useGetBorrowerFormsMutation();
    const [getFormId] = useGetFormIdMutation();
    const [matrix, setMatrix] = useState<MatrixType>({});
    const mapRef = useRef<Map<string, string>>(new Map());
    const { firstName, lastName, age, gender, email, phone } = auth?.user;
    const [profileData, setProfileData] = useState<{ [key: string]: any }>({
        age: age ?? '',
        email: email ?? '',
        firstName: firstName ?? '',
        gender: gender !== 'u' ? gender : '',
        lastName: lastName ?? '',
        phone: phone ?? ''
    });
    const [isValidating, setIsValidating] = useState(false);

    const router = useRouter();

    const addOrUpdateElement = (
        rowKey: string,
        columnKey: number,
        value: string
    ) => {
        const position = `${rowKey}-${columnKey}`;

        mapRef.current.set(position, value);

        setMatrix((prevMatrix) => {
            const newMatrix: MatrixType = { ...prevMatrix };

            if (!newMatrix[rowKey]) {
                newMatrix[rowKey] = {};
            }
            newMatrix[rowKey][columnKey] = position;

            return newMatrix;
        });
    };

    const getElement = (rowKey: any, columnKey: number) => {
        const position = matrix[rowKey]?.[columnKey];

        return position ? mapRef.current.get(position) : undefined;
    };

    const addFullJson = (json: MatrixJsonType) => {
        const { form: jsonMatrix } = json;

        for (const rowKey in jsonMatrix) {
            const row = jsonMatrix[rowKey];

            for (const columnKey in row) {
                const value = row[columnKey];

                addOrUpdateElement(rowKey, Number(columnKey), value);
            }
        }
    };

    useEffect(() => {
        setReadyToProceed(true);
    }, [page]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!signature) {
                    return router.push('/microcredit/apply');
                }

                const formData = await getBorrowerForms(
                    auth?.user?.address
                ).then(async (borrowerData: any) => {
                    // if borrower don't have data i don't need to make the next request
                    return await getFormId(borrowerData?.data?.forms[0]?.id);
                });

                setFormApiData(formData);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [auth?.user?.address]);

    useEffect(() => {
        const titleArray: any = [];
        const formArray: any = [];
        let currentForm: any, id: any;

        if (!!formApiData?.data) {
            const { prismicId, form } = formApiData?.data ?? {
                form: {},
                prismicId: ''
            };

            id = prismicId;

            addFullJson({
                form,
                prismicId,
                submit: false
            });

            let doc: any = [];

            if (!Array.isArray(view)) {
                doc = [view];
            }

            const element = doc?.find((obj: any) => obj.id === prismicId);

            currentForm = element?.data;

            if (element === undefined) {
                const alt = view?.find((obj: any) =>
                    obj.alternate_languages.find(
                        (langs: any) => langs?.id === prismicId
                    )
                );

                currentForm = alt?.data;

                if (alt === undefined) {
                    id = view[0]?.id;
                    currentForm = view[0]?.data;
                }
            }
        } else if (Array.isArray(view)) {
            id = view[0]?.id;
            currentForm = view[0]?.data;
        } else {
            id = view?.id;
            currentForm = view?.data;
        }

        setPrismicId(id);
        setTitle(currentForm?.title);
        setDescription(currentForm?.description);

        !!currentForm &&
            Object.keys(currentForm).forEach((key) => {
                if (key.includes('page')) {
                    if (/\d+Title$/.test(key)) {
                        titleArray.push(currentForm[key][0]?.text);
                    } else if (/\d+Form$/.test(key)) {
                        formArray.push(currentForm[key]);
                    }
                }
            });

        setFormArray(formArray);
        setTitleArray(titleArray);
    }, [formApiData]);

    const getMatrixWithValues = () => {
        const matrixWithValues: {
            [row: string]: { [column: string]: string };
        } = {};

        for (const rowKey in matrix) {
            const row = matrix[rowKey];

            matrixWithValues[rowKey] = {};

            for (const columnKey in row) {
                const value = getElement(rowKey, Number(columnKey));

                matrixWithValues[rowKey][columnKey] = value || '';
            }
        }

        return matrixWithValues;
    };

    const updateProfile = async () => {
        try {
            const result = await updateUser(profileData).unwrap();

            if (result) {
                dispatch(setUser({ user: { ...result } }));
            }

            return true;
        } catch (e: any) {
            console.log(e);
            toast.error(<Message id="errorOccurred" />);

            return false;
        }
    };

    const validateFields = () => {
        let formIsReady = true;

        formArray[page]?.map((section: any) => {
            const formValues = getMatrixWithValues();

            if (section.id.toString().includes('double_input')) {
                let counter = 0;

                section.items.map((el: any) => {
                    // const value1 = formValues[section.id.toString()][
                    //     counter.toString()
                    // ] as any;

                    // if (!value1?.data) {
                    //     formIsReady = false;
                    // }
                    const sectionId = section.id.toString();
                    const idxString = counter.toString();

                    const value = formValues[sectionId] && formValues[sectionId][idxString] ? formValues[sectionId][idxString] : undefined as any;

                    if (value === undefined || !value?.data) {
                        formIsReady = false;
                    }
                    counter++;

                    const sectionId2 = section.id.toString();
                    const idxString2 = counter.toString();

                    const value2 = formValues[sectionId2] && formValues[sectionId2][idxString2] ? formValues[sectionId2][idxString2] : undefined as any;

                    if (value2 === undefined || (!value2?.data && !!el?.type2)) {
                        formIsReady = false;
                    }

                    // const value2 = formValues[section.id.toString()][
                    //     counter.toString()
                    // ] as any;

                    // if (!value2?.data && !!el?.type2) {
                    //     formIsReady = false;
                    // }

                    counter++;
                });
            } else if (
                section.id.toString().includes('full_width_form_field') ||
                section.id.toString().includes('mobile_banker_selector')
            ) {
                section.items.map((field: any, idx: number) => {
                    if (field?.type === 'Checkbox') {
                        field.options.map((_: any, index: number) => {
                            const value = formValues[section.id.toString()][
                                index.toString()
                            ] as any;

                            if (!value?.data) {
                                formIsReady = false;
                            }
                        });
                    } else {
                        const sectionId = section.id.toString();
                        const idxString = idx.toString();

                        const value = formValues[sectionId] && formValues[sectionId][idxString] ? formValues[sectionId][idxString] : undefined as any;

                        if (value === undefined || !value?.data) {
                            formIsReady = false;
                        }



                        // const value = formValues[section.id.toString()][
                        //     idx.toString()
                        // ] as any;

                        // if (!value?.data) {
                        //     formIsReady = false;
                        // }
                    }
                });
            } else if (section.id.toString().includes('profile')) {
                for (const key in profileData) {
                    if (profileData.hasOwnProperty(key)) {
                        const value = profileData[key];

                        if (!value) {
                            formIsReady = false;
                        }
                    }
                }

                if (formIsReady) {
                    updateProfile();
                }
            }
        });

        return formIsReady;
    };

    const handleButtonClick = () => {
        setIsValidating(true);
        const formIsReady = validateFields();

        if (formIsReady) {
            const response = submitFormData(false);

            if (!!response) {
                setPage(page + 1);
            }
        } else {
            setReadyToProceed(false);
        }
        setIsValidating(false);
    };

    const submitFormData = async (status: boolean) => {
        const matrixJson: MatrixJsonType = {
            form: getMatrixWithValues(),
            prismicId,
            submit: status
        };

        const response = await submitForm(matrixJson as any);

        console.log(response);

        return response;
    };

    const goToPage = (step: number) => {
        const pageToGo = step - 1;

        if (pageToGo <= page) {
            setPage(pageToGo);
        }
    };

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <Box fLayout="start between" fWrap="wrap" flex>
                <Box column flex pr={{ sm: 2, xs: 0 }}>
                    <Display g900 medium>
                        {title}
                    </Display>
                    <RichText content={description} g500 mt={0.25} />
                </Box>

                <Box padding="3rem 0" w="100%">
                    <Box>
                        <ProgressIndicator
                            currentStep={page + 1}
                            onStepClick={(step: number) => goToPage(step)}
                            steps={titleArray.length}
                            stepsTitles={titleArray}
                        />
                    </Box>
                </Box>
            </Box>
            {formArray[page]?.map((el: any) => {
                if (el.slice_type !== 'profile') {
                    return (
                        el.slice_type !== 'profile' && (
                            <FormSection
                                items={el?.items}
                                primary={el?.primary}
                                fieldType={el.slice_type}
                                sectionId={el.id}
                                updateFormData={addOrUpdateElement}
                                getElement={getElement}
                            />
                        )
                    );
                } else if (el?.slice_type === 'profile') {
                    return (
                        <Profile
                            fieldType={el.slice_type}
                            idx={0}
                            primary={el?.primary}
                            profileData={profileData}
                            sectionId={el.id}
                            setProfileData={setProfileData}
                        />
                    );
                }
            })}
            <Row>
                <Col
                    colSize={{ sm: 4, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                ></Col>
                <Col
                    colSize={{ sm: 8, xs: 12 }}
                    pb={1.25}
                    pt={{ sm: 1.25, xs: 0 }}
                >
                    <Box flex fLayout="start between">
                        <Button
                            onClick={() => setPage(page - 1)}
                            disabled={!page}
                            gray
                        >
                            {t('previousStep')}
                        </Button>
                        {page !== formArray.length - 1 && (
                            <Button
                                isLoading={isValidating}
                                onClick={handleButtonClick}
                                gray
                            >
                                {t('nextStep')}
                            </Button>
                        )}
                        {page === formArray.length - 1 && (
                            <Button
                                isLoading={isValidating}
                                onClick={async () => {
                                    setIsValidating(true);
                                    const formIsReady = validateFields();

                                    if (formIsReady) {
                                        const response = (await submitFormData(
                                            true
                                        )) as any;

                                        if (!!response) {
                                            router.push(
                                                `/microcredit/apply?success=true&formId=${response?.data?.id}`
                                            );
                                        }
                                    } else {
                                        setReadyToProceed(false);
                                    }
                                    setIsValidating(false);
                                }}
                            >
                                {t('submitForm')}
                            </Button>
                        )}
                    </Box>
                    {!readyToProceed && (
                        <Box flex fLayout="end">
                            <Text e500 bold>
                                {'* All fields are required'}
                            </Text>
                        </Box>
                    )}
                </Col>
            </Row>
        </ViewContainer>
    );
};

export default ApplicationForm;
