import { emptySplitApi } from './index';

interface PreSigned {
    filePath?: string;
    filename?: string;
    uploadURL?: string;
}

interface Form {
    [row: string]: {
        [column: string]: {
            data: string;
            review: string;
            hint: string;
        };
    };
}

interface AplicationFormProps {
    form: Form;
    prismicId: string;
    submit: boolean;
}

// Define a service using a base URL and expected endpoints
export const microcreditApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getBorrowerForms: builder.mutation<any, { address: string }>({
            query: (address: any) => ({
                method: 'GET',
                url: `microcredit/borrower?address=${address}&include=forms`
            }),
            transformResponse: (response: { data?: any }) => response.data
        }),
        getFormId: builder.mutation<any, { formId: string }>({
            query: (formId: any) => ({
                method: 'GET',
                url: `microcredit/form/${formId}`
            }),
            transformResponse: (response: { data?: any }) => response.data
        }),
        getMicrocreditPreSigned: builder.mutation<PreSigned, string>({
            query: (type: string) => ({
                method: 'GET',
                url: `/microcredit/presigned?mime=${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
        }),
        submitForm: builder.mutation<AplicationFormProps, AplicationFormProps>({
            query: (body) => ({
                body,
                method: 'POST',
                url: 'microcredit/form'
            }),
            transformResponse: (response: { data?: AplicationFormProps }) =>
                response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
    useGetBorrowerFormsMutation,
    useGetFormIdMutation,
    useGetMicrocreditPreSignedMutation,
    useSubmitFormMutation,
 } = microcreditApi;
