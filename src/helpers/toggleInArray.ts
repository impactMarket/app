import toArray from './toArray';

const toggleInArray = (value: string, arr: string | string[]) => {
    const result = toArray(arr);

    if (result.includes(value)) {
        return result.filter((val: string) => val !== value);
    }

    return [...result, value];
};

export default toggleInArray;
