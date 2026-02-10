export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeEachWord = (str) => {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const removeUnnecessarySpaces = (str) => {
    return str
        .trim()              // remove leading & trailing spaces
        .replace(/\s+/g, " "); // collapse multiple spaces into one
}

export const normalizeArray = (arr) =>
    Array.isArray(arr)
        ? arr
            .map(v => removeUnnecessarySpaces(v))
            .filter(Boolean) // removes "" and "   "
        : [];
