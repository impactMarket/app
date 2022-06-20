export const toCamelCase = (str: string) => {
    let newStr = "";

    if (str) {
        const wordArr = str.toLowerCase().split(/[-_]/g);
        
        for (let i = 0; i < wordArr.length; i++) {
            if (i > 0) {
                newStr += wordArr[i].charAt(0).toUpperCase() + wordArr[i].slice(1);
            }
            else {
                newStr += wordArr[i];
            }
        }
    }

    return newStr;
}
