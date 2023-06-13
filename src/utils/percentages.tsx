export const formatPercentage = (number: number) => {
    return new Intl.NumberFormat('default', {
        maximumFractionDigits: 0,
        style: 'percent'
    }).format(number);
};
