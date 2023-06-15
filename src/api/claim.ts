import { emptySplitApi } from './index';

interface Claim {
    communityId: number;
    gps: {
        latitude: number;
        longitude: number;
    };
}

// Define a service using a base URL and expected endpoints
export const claimApi = emptySplitApi.injectEndpoints({
    endpoints: (builder) => ({
        saveClaimLocation: builder.mutation<Claim, Claim>({
            query: (body) => ({
                body,
                method: 'POST',
                url: 'claims-location'
            }),
            transformResponse: (response: { data?: Claim }) => response.data
        })
    })
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useSaveClaimLocationMutation } = claimApi;
