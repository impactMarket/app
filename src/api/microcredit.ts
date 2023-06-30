import { emptySplitApi } from './index';

interface PreSigned {
    filePath?: string;
    filename?: string;
    uploadURL?: string;
}

// Define a service using a base URL and expected endpoints
export const microcreditApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        getMicrocreditPreSigned: builder.mutation<PreSigned, string>({
            query: (type: string) => ({
                method: 'GET',
                url: `/microcredit/presigned?mime=${type}`
            }),
            transformResponse: (response: { data: PreSigned }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetMicrocreditPreSignedMutation } = microcreditApi;
