import useSWR from 'swr';

export default function useClaimsLocation() {
    const { data, mutate, error } = useSWR(`/claims-location`);
    const claimsArray: Array<{ latitude: number; longitude: number }> = [];

    data?.map((location: { gps: any }) => {
        claimsArray.push({ ...location.gps });
    });

    const loadingClaims = !data && !error;

    return {
        claimsLocations: claimsArray,
        loadingClaims,
        mutate
    };
}
