export const toCamelCase = (str: string, prefix?: string) => {
    let newStr = '';

    if (str) {
        const wordArr = str.toLowerCase().split(/[-_]/g);

        for (let i = 0; i < wordArr.length; i++) {
            if (i > 0) {
                newStr = `${newStr}${wordArr[i]
                    .charAt(0)
                    .toUpperCase()}${wordArr[i].slice(1)}`;
            } else {
                newStr = `${newStr}${wordArr[i]}`;
            }
        }

        if (prefix) {
            newStr = `${prefix}${newStr.charAt(0).toUpperCase()}${newStr.slice(
                1
            )}`;
        }
    }

    return newStr;
};
