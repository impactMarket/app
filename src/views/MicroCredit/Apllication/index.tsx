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
    useGetBorrowerMutation,
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

const ApplicationForm = (props: any) => {
    const { data } = props;

    console.log(data);
    
    const auth = useSelector(selectCurrentUser);
    const { signature } = useSelector(selectCurrentUser);
    // Get data from props
    const { view } = usePrismicData();
    const [page, setPage] = useState(0);
    const [formArray, setFormArray] = useState([]);
    const [titleArray, setTitleArray] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [prismicId, setPrismicId] = useState('');
    const [formApiData, setFormApiData] = useState({} as any);

    const [submitForm] = useSubmitFormMutation();
    const [getBorrower] = useGetBorrowerMutation();
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

    // useEffect(() => {
    // const matrixJson: MatrixJsonType = {
    //     prismicId: 'za85748jf',
    //     form: getMatrixWithValues()
    // };

    // const jsonMatrix = JSON.stringify(matrixJson, null, 2);
    //     console.log(jsonMatrix);
    // }, [matrix]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!signature) {
                    // await handleSignature(signMessage);
                }

                const formData = await getBorrower(auth?.user?.address).then(
                    async (borrowerData: any) => {
                        console.log(borrowerData);

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
    }, []);

    useEffect(() => {
        // addFullJson({
        //     prismicId,
        //     form
        // });
        const titleArray: any = [];
        const formArray: any = [];
        let currentForm: any, id: any;

        if (!!formApiData?.data) {
            // debugger
            const { prismicId, form } = formApiData?.data ?? {
                form: {},
                prismicId: '',
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
            // debugger
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
                        titleArray.push(currentForm[key]);
                    } else if (/\d+Form$/.test(key)) {
                        // debugger
                        formArray.push(currentForm[key]);
                    }
                }
            });

        setFormArray(formArray);
        setTitleArray(titleArray);
    }, [formApiData]);

    // useEffect(() => {
    //     addFullJson({
    //         "prismicId": "za85748jf",
    //         "form": {
    //           "full_width_form_field$4821e2c1-0044-46c5-a6e7-e4a9252a731f": {
    //             "0": "0"
    //           },
    //           "full_width_form_field$a9552890-5f38-4bcd-b2ad-bf00e8999755": {
    //             "0": "1"
    //           },
    //           "double_input$698174d7-c938-4fc5-9b60-7eae5e4f3493": {
    //             "0": "Paulo",
    //             "1": "Sousa",
    //             "2": "36",
    //             "4": "BO"
    //           },
    //           "full_width_form_field$5f936942-0874-472d-9365-ba40f4c35d98": {
    //             "0": "1",
    //             "1": "0"
    //           },
    //           "full_width_form_field$b6fc9f3c-2600-4c15-ac6f-5152f63be31d": {
    //             "0": "place"
    //           }
    //         }
    //       })
    // }, []);

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

    // console.log(formArray[2]);
    

    return (
        <ViewContainer {...({} as any)} isLoading={false}>
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
                            <Button onClick={() => setPage(page + 1)} gray>
                                {'Next Step'}
                            </Button>
                        )}
                        {page === formArray.length - 1 && (
                            <Button
                                onClick={async () => {
                                    const matrixJson: MatrixJsonType = {
                                        form: getMatrixWithValues(),
                                        prismicId,
                                        submit: false
                                    };

                                    const response = await submitForm(
                                        matrixJson as any
                                    );

                                    console.log(response);

                                    if (!!response) {
                                        router.push(
                                            '/microcredit/apply?success=true'
                                        );
                                    }
                                }}
                            >
                                {'Submit'}
                            </Button>
                        )}
                    </Box>
                </Col>
            </Row>
        </ViewContainer>
    );
};

export default ApplicationForm;
