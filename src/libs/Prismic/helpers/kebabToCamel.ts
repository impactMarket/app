const kebabToCamel = (string?: string) => {
    if (!string) {
        return;
    }

    return string?.replace(/-./g, (x) => x[1].toUpperCase());
};

export default kebabToCamel;
