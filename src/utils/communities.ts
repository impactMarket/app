import { frequencyToNumber } from '@impact-market/utils';

// TODO: check these calculations (code from mobile app is commented, new version seems to fix error in months...)
// NOTE: in mobile app it has parseInt() for maxClaim and claimAmount, but it's wrong. If we have decimals, it will loose them. Must use parseFloat()
export const getExpectedUBIDuration = (claimAmountWatch: string, maxClaimWatch: string, baseIntervalWatch: "day" | "week", incrementIntervalWatch: string) => {
    const totalClaims = parseFloat(maxClaimWatch) / parseFloat(claimAmountWatch);
    const estimatedSeconds = frequencyToNumber(baseIntervalWatch) * (totalClaims - 2) + parseInt(incrementIntervalWatch, 10) * (totalClaims - 1) * 12;

    // const years = Math.floor(estimatedSeconds / 31536000);
    // const months = Math.floor((estimatedSeconds % 2629800) / 86400);
    // const days = Math.floor(((estimatedSeconds % 31536000) % 2629800) / 86400);
    // const hours = Math.floor(((estimatedSeconds % 31536000) % 86400) / 3600);
    // const minutes = Math.floor((((estimatedSeconds % 31536000) % 86400) % 3600) / 60);

    const years = Math.floor(estimatedSeconds / 31536000);
    const months = Math.floor((estimatedSeconds % 31536000) / 2628000);
    const days = Math.floor(((estimatedSeconds % 31536000) % 2628000) / 86400);
    const hours = Math.floor((((estimatedSeconds % 31536000) % 2628000) % 86400) / 3600);
    const minutes = Math.floor((((estimatedSeconds % 31536000) % 86400) % 3600) / 60);
    
    return {
        days,
        hours,
        minutes,
        months,
        years
    };
}
