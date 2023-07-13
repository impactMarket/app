import {
    Box,
    Button,
    Col,
    Display,
    ProgressIndicator,
    Row,
    ViewContainer
} from '@impact-market/ui';
import { selectCurrentUser } from '../../../state/slices/auth';
import { useEffect, useRef, useState } from 'react';
import {
    useGetBorrowerFormsMutation,
    useGetFormIdMutation,
    useSubmitFormMutation
} from '../../../api/microcredit';
import { usePrismicData } from '../../../libs/Prismic/components/PrismicDataProvider';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import FormSection from './FormSection';
import RichText from '../../../libs/Prismic/components/RichText';

type MatrixType = Record<string, Record<string, string | undefined>>;
type MatrixJsonType = {
    prismicId: string;
    form: MatrixType;
    submit: boolean;
};

const ApplicationForm = () => {
    // const { data } = props;
    const auth = useSelector(selectCurrentUser);
    const { signature } = useSelector(selectCurrentUser);
    // Get data from props
    const { view } = usePrismicData();
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [formArray, setFormArray] = useState([]);
    const [titleArray, setTitleArray] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prismicId, setPrismicId] = useState('');
    const [formApiData, setFormApiData] = useState({} as any);
    const [readyToProceed, setReadyToProceed] = useState(false);
    const [submitForm] = useSubmitFormMutation();
    const [getBorrowerForms] = useGetBorrowerFormsMutation();
    const [getFormId] = useGetFormIdMutation();
    const [matrix, setMatrix] = useState<MatrixType>({});
    const mapRef = useRef<Map<string, string>>(new Map());

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
        // console.log(getMatrixWithValues());
        setReadyToProceed(validateFields());
        setIsLoading(false);

        // const matrixJson: MatrixJsonType = {
        //     prismicId: 'za85748jf',
        //     form: getMatrixWithValues()
        // };

        // const jsonMatrix = JSON.stringify(matrixJson, null, 2);
        //     console.log(jsonMatrix);
    }, [matrix]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!signature) {
                    // Send back
                    // await handleSignature(signMessage);
                }

                console.log(auth?.user?.address);
                

                const formData = await getBorrowerForms(auth?.user?.address).then(
                    async (borrowerData: any) => {

                        // if borrower don't have data i don't need to make the next request
                        return await getFormId(
                            borrowerData?.data?.forms[0]?.id
                        );
                    }
                );

                setFormApiData(formData);
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

            const element = view.find((obj: any) => obj.id === prismicId);

            currentForm = element?.data;

            if (element === undefined) {
                const alt = view.find((obj: any) =>
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
        } else {
            id = view[0]?.id;
            currentForm = view[0]?.data;
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

    const validateFields = () => {
        let formIsReady = true;

        formArray[page]?.map((section: any) => {
            const formValues = getMatrixWithValues();

            if (section.id.toString().includes('double_input')) {
                let counter = 0;

                section.items.map((el: any) => {
                    const value1 = formValues[section.id.toString()][
                        counter.toString()
                    ] as any;

                    if (!value1?.data) {
                        formIsReady = false;
                    }
                    counter++;

                    const value2 = formValues[section.id.toString()][
                        counter.toString()
                    ] as any;

                    if (!value2?.data && !!el?.type2) {
                        formIsReady = false;
                    }

                    counter++;
                });
            } else {
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
                        const value = formValues[section.id.toString()][
                            idx.toString()
                        ] as any;

                        if (!value?.data) {
                            formIsReady = false;
                        }
                    }
                });
            }
        });

        return formIsReady;
    };

    const handleButtonClick = () => {
        const formIsReady = validateFields();

        if (formIsReady) {
            const response = submitFormData(false);

            if (!!response) {
                setPage(page + 1);
            }
        }
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

    return (
        <ViewContainer {...({} as any)} isLoading={isLoading}>
            <Box fLayout="start between" fWrap="wrap" flex>
                <Box column flex pr={{ sm: 2, xs: 0 }}>
                    <Display g900 medium>
                        {title}
                    </Display>
                    <RichText content={description} g500 mt={0.25} />
                </Box>

                <Box padding="3 0" w="100%">
                    <Box>
                        <ProgressIndicator
                            currentStep={page + 1}
                            onStepClick={() => {}}
                            steps={titleArray.length}
                            // stepsTitles={titleArray}
                        />
                    </Box>
                </Box>
            </Box>
            {formArray[page]?.map((el: any) => (
                <FormSection
                    items={el?.items}
                    title={el?.primary?.title}
                    description={el?.primary?.description}
                    fieldType={el.slice_type}
                    sectionId={el.id}
                    updateFormData={addOrUpdateElement}
                    getElement={getElement}
                />
            ))}
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
                            {'Previous Step'}
                        </Button>
                        {page !== formArray.length - 1 && (
                            <Button
                                disabled={!readyToProceed}
                                onClick={handleButtonClick}
                                gray
                            >
                                {'Next Step'}
                            </Button>
                        )}
                        {page === formArray.length - 1 && (
                            <Button
                                disabled={!readyToProceed}
                                onClick={() => {
                                    // const matrixJson: MatrixJsonType = {
                                    //     form: getMatrixWithValues(),
                                    //     prismicId,
                                    //     submit: true
                                    // };

                                    const response = submitFormData(true);

                                    if (!!response) {
                                        router.push(
                                            '/microcredit/apply?success=true'
                                        );
                                    }
                                }}
                            >
                                {'Submit Form'}
                            </Button>
                        )}
                    </Box>
                </Col>
            </Row>
        </ViewContainer>
    );
};

export default ApplicationForm;
